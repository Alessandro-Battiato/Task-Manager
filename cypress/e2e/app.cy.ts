describe("Task Hive Application", () => {
    beforeEach(() => {
        cy.intercept(
            {
                method: "GET",
                url: "https://app.asana.com/api/1.0/projects*", // wildcard to handle opt_fields, workspace, ecc.
            },
            {
                statusCode: 200,
                fixture: "projects.json",
            }
        ).as("getProjects");

        cy.visit("/");

        cy.wait("@getProjects");
    });

    describe("Initial Load", () => {
        it("should display the main layout correctly", () => {
            cy.get('[data-testid="sidebar"]').should("be.visible");

            cy.get('[data-testid="board"]').should("be.visible");

            cy.get('[data-testid="empty-state"]').should("be.visible");
            cy.contains("Create or select a Project to start").should(
                "be.visible"
            );
        });

        it("should display project list", () => {
            cy.get('[data-testid="projects-list"]').should("be.visible");
            cy.get('[data-testid="p1"]').should("contain", "Design Board");
            cy.get('[data-testid="p2"]').should("contain", "Learning Board");
        });
    });

    describe("Theme Toggle", () => {
        it("should toggle between light and dark theme", () => {
            cy.get("html").should("have.attr", "data-theme", "light");

            cy.get('[data-testid="theme-dark"]').click();
            cy.get("html").should("have.attr", "data-theme", "dark");

            cy.get('[data-testid="theme-light"]').click();
            cy.get("html").should("have.attr", "data-theme", "light");
        });

        it("should persist theme preference", () => {
            cy.get('[data-testid="theme-dark"]').click();
            cy.get("html").should("have.attr", "data-theme", "dark");

            cy.reload();

            cy.get("html").should("have.attr", "data-theme", "dark");
        });
    });

    describe("Mobile Responsive", () => {
        beforeEach(() => {
            cy.viewport("iphone-x");
        });

        it("should display mobile layout correctly", () => {
            cy.get('[data-testid="sidebar"]').should("not.be.visible");

            cy.get('[data-testid="mobile-header"]').should("be.visible");

            cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
        });

        it("should open and close mobile sidebar", () => {
            cy.openMobileSidebar();
            cy.get('[data-testid="mobile-sidebar"]').should("be.visible");

            cy.get('[data-testid="mobile-sidebar"]').within(() => {
                cy.get('[data-testid="p1"]').should("be.visible");
            });

            cy.get('[data-testid="close-sidebar-btn"]').click();
            cy.get('[data-testid="mobile-sidebar"]').should("not.exist");
        });

        it("should close mobile sidebar when project is selected", () => {
            cy.openMobileSidebar();
            cy.get('[data-testid="mobile-sidebar"]').should("be.visible");

            cy.get('[data-testid="mobile-sidebar"]').within(() => {
                cy.get('[data-testid="p1"]').click();
            });

            cy.get('[data-testid="mobile-sidebar"]').should("not.exist");
        });

        it("should toggle theme on mobile", () => {
            cy.get('[data-testid="mobile-theme-toggle"]')
                .parent("label")
                .click();
            cy.get("html").should("have.attr", "data-theme", "dark");

            cy.get('[data-testid="mobile-theme-toggle"]')
                .parent("label")
                .click();
            cy.get("html").should("have.attr", "data-theme", "light");
        });
    });

    describe("Project Selection", () => {
        beforeEach(() => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects/p1/tasks*",
                },
                {
                    statusCode: 200,
                    fixture: "tasks.json",
                }
            ).as("getTasks");
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects/p2/tasks*",
                },
                {
                    statusCode: 200,
                    fixture: "tasks.json",
                }
            ).as("getTasks");
        });

        it("should select a project and update the UI", () => {
            cy.selectProject("p1");
            cy.wait("@getTasks");

            cy.get('[data-testid="p1"]').within(() => {
                cy.get("button").should("have.class", "border-primary");
            });

            cy.get('[data-testid="empty-state"]').should("not.exist");

            cy.get('[data-testid="column-Backlog"]').should("be.visible");
            cy.get('[data-testid="column-InProgress"]').should("be.visible");
            cy.get('[data-testid="column-InReview"]').should("be.visible");
            cy.get('[data-testid="column-Completed"]').should("be.visible");
        });

        it("should switch between projects", () => {
            cy.selectProject("p1");
            cy.wait("@getTasks");

            cy.get('[data-testid="p1"]').within(() => {
                cy.get("button").should("have.class", "border-primary");
            });

            cy.selectProject("p2");
            cy.wait("@getTasks");

            cy.get('[data-testid="p2"]').within(() => {
                cy.get("button").should("have.class", "border-primary");
            });

            cy.get('[data-testid="p1"]').within(() => {
                cy.get("button").should("not.have.class", "border-primary");
            });
        });

        it("should show loading state while fetching projects", () => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects*",
                },
                {
                    statusCode: 200,
                    fixture: "projects.json",
                    delay: 1000,
                }
            ).as("getProjectsWithDelay");

            cy.visit("/");

            cy.get('[data-testid="projects-loading"]').should("be.visible");

            cy.wait("@getProjectsWithDelay");

            cy.get('[data-testid="projects-loading"]').should("not.exist");
            cy.get('[data-testid="projects-list"]').should("be.visible");
        });

        it("should show error state when projects fail to load", () => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects*",
                },
                {
                    statusCode: 500,
                    body: { error: "Internal Server Error" },
                }
            ).as("getProjectsError");

            cy.visit("/");
            cy.wait("@getProjectsError");

            cy.get('[data-testid="projects-error"]').should("be.visible");
            cy.contains("Failed to load projects").should("be.visible");

            cy.get('[data-testid="projects-list"]').should("not.exist");
        });

        it("should show loading state in mobile sidebar", () => {
            cy.viewport("iphone-x");

            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects*",
                },
                {
                    statusCode: 200,
                    fixture: "projects.json",
                    delay: 1000,
                }
            ).as("getProjectsWithDelay");

            cy.visit("/");

            cy.openMobileSidebar();

            cy.get('[data-testid="mobile-projects-loading"]').should(
                "be.visible"
            );

            cy.wait("@getProjectsWithDelay");

            cy.get('[data-testid="mobile-projects-loading"]').should(
                "not.exist"
            );
            cy.get('[data-testid="mobile-sidebar"]').within(() => {
                cy.get('[data-testid="p1"]').should("be.visible");
            });
        });

        it("should show error state in mobile sidebar", () => {
            cy.viewport("iphone-x");

            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects*",
                },
                {
                    statusCode: 500,
                    body: { error: "Internal Server Error" },
                }
            ).as("getProjectsError");

            cy.visit("/");
            cy.wait("@getProjectsError");

            cy.openMobileSidebar();

            cy.get('[data-testid="mobile-projects-error"]').should(
                "be.visible"
            );
            cy.get('[data-testid="mobile-sidebar"]').within(() => {
                cy.contains("Failed to load projects").should("be.visible");
            });
        });
    });

    describe("Board Functionality", () => {
        beforeEach(() => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects/p1/tasks*",
                },
                {
                    statusCode: 200,
                    fixture: "tasks.json",
                }
            ).as("getTasks");
        });

        it("should display board columns with correct headers", () => {
            cy.selectProject("p1");
            cy.wait("@getTasks");

            cy.get('[data-testid="column-Backlog"]').within(() => {
                cy.contains("Backlog").should("be.visible");
                cy.get('[data-testid="status-badge"]').should("be.visible");
            });

            cy.get('[data-testid="column-InProgress"]').within(() => {
                cy.contains("In Progress").should("be.visible");
                cy.get('[data-testid="status-badge"]').should("be.visible");
            });

            cy.get('[data-testid="column-InReview"]').within(() => {
                cy.contains("In Review").should("be.visible");
                cy.get('[data-testid="status-badge"]').should("be.visible");
            });

            cy.get('[data-testid="column-Completed"]').within(() => {
                cy.contains("Completed").should("be.visible");
                cy.get('[data-testid="status-badge"]').should("be.visible");
            });
        });

        it("should show loading state when fetching tasks", () => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects/p1/tasks*",
                },
                {
                    statusCode: 200,
                    fixture: "tasks.json",
                    delay: 1000,
                }
            ).as("getTasksWithDelay");

            cy.selectProject("p1");
            cy.get('[data-testid="loading-skeleton"]').should("be.visible");

            cy.wait("@getTasksWithDelay");

            cy.get('[data-testid="loading-skeleton"]').should("not.exist");
        });

        it("should handle API errors efficiently", () => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects/p1/tasks*",
                },
                {
                    statusCode: 500,
                    body: { error: "Internal Server Error" },
                }
            ).as("getTasksError");

            cy.selectProject("p1");
            cy.wait("@getTasksError");

            cy.get('[data-testid="error-state"]').should("be.visible");
            cy.contains("Something went wrong while loading the tasks!").should(
                "be.visible"
            );
        });
    });
});
