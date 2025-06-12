describe("Project Selection", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();

            cy.setupProjectsAndTasks();
        });

        it("should select a project and update the UI", () => {
            cy.selectProject("p1");
            cy.wait("@getTasksP1");

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
            cy.wait("@getTasksP1");

            cy.get('[data-testid="p1"]').within(() => {
                cy.get("button").should("have.class", "border-primary");
            });

            cy.selectProject("p2");
            cy.wait("@getTasksP2");

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
            cy.get('[data-testid="project-list"]').should("be.visible");
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

            cy.get('[data-testid="project-list"]').should("not.exist");
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
});
