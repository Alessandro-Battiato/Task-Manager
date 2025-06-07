import { Project } from "../../src/types/project";

describe("Task Hive Application", () => {
    context("When projects exist", () => {
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
                cy.get('[data-testid="project-list"]').should("be.visible");
                cy.get('[data-testid="p1"]').should("contain", "Design Board");
                cy.get('[data-testid="p2"]').should(
                    "contain",
                    "Learning Board"
                );
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

                cy.get('[data-testid="mobile-menu-button"]').should(
                    "be.visible"
                );
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
                cy.get('[data-testid="column-InProgress"]').should(
                    "be.visible"
                );
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

            it("should delete a project and update the UI", () => {
                cy.intercept("DELETE", "**/projects/p1", {
                    statusCode: 200,
                }).as("deleteProject");

                cy.get('[data-testid="project-btn-p1-delete-btn"]').click();

                cy.get('[data-testid="confirm-delete-btn"]').click();

                cy.wait("@deleteProject");

                cy.fixture("projects.json").then((projects) => {
                    const updatedProjects = {
                        data: projects.data.filter(
                            (p: Project) => p.gid !== "p1"
                        ),
                    };

                    cy.intercept("GET", "**/projects*", {
                        statusCode: 200,
                        body: updatedProjects,
                    }).as("getProjectsAfterDelete");
                });

                cy.reload();
                cy.wait("@getProjectsAfterDelete");

                cy.get('[data-testid="project-btn-p1"]').should("not.exist");
                cy.get('[data-testid="project-btn-p2"]').should("exist");
            });
        });

        describe("Project Creation", () => {
            beforeEach(() => {
                cy.intercept("GET", "**/projects*", {
                    statusCode: 200,
                    fixture: "createProject.json",
                }).as("getProjectsUpdated");
            });

            it("should create project successfully", () => {
                cy.intercept("POST", "**/projects", { statusCode: 200 }).as(
                    "createProjectSlow"
                );

                cy.get('[data-testid="create-project-btn-desktop"]').click();

                cy.get('[data-testid="project-name-input"]').type(
                    "New Test Project"
                );
                cy.get('[data-testid="logo-option-2"]').click();

                cy.get('[data-testid="create-project-submit"]').click();

                cy.wait("@createProjectSlow").then((interception) => {
                    expect(interception.request.body).to.have.property("data");
                    expect(interception.request.body.data.name).to.equal(
                        "🚀 New Test Project"
                    );
                });

                cy.wait("@getProjectsUpdated");
                cy.get('[data-testid="project-list"]').should(
                    "contain",
                    "🚀 New Test Project"
                );
            });

            it("should prevent multiple submissions", () => {
                let callCount = 0;

                cy.intercept("POST", "**/projects", (req) => {
                    callCount++;
                    req.reply({
                        statusCode: 201,
                        body: {
                            data: {
                                gid: "mocked-project-id",
                                name: "Test Project",
                            },
                        },
                        delay: 500,
                    });
                }).as("createProjectSlow");

                cy.get('[data-testid="create-project-btn-desktop"]').click();
                cy.get('[data-testid="project-name-input"]').type(
                    "Test Project"
                );

                cy.get('[data-testid="logo-option-2"]').click();

                cy.get('[data-testid="create-project-submit"]').click();

                cy.get('[data-testid="create-project-submit"]').click({
                    force: true,
                });
                cy.get('[data-testid="create-project-submit"]').click({
                    force: true,
                });

                cy.wait("@createProjectSlow").then(() => {
                    expect(callCount).to.equal(1);
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
                cy.contains(
                    "Something went wrong while loading the tasks!"
                ).should("be.visible");
            });
        });

        describe("Task Operations", () => {
            beforeEach(() => {
                cy.intercept("GET", "**/projects/p1/tasks*", {
                    statusCode: 200,
                    fixture: "tasks.json",
                }).as("getTasks");

                cy.intercept("GET", "**/projects/*/sections*", {
                    statusCode: 200,
                    body: {
                        data: [
                            { gid: "section-1", name: "Backlog" },
                            { gid: "section-2", name: "InProgress" },
                            { gid: "section-3", name: "InReview" },
                            { gid: "section-4", name: "Completed" },
                        ],
                    },
                }).as("getSections");
            });

            context("When project is selected", () => {
                beforeEach(() => {
                    cy.selectProject("p1");
                    cy.wait("@getTasks");
                });

                it("shows create task button", () => {
                    cy.get('[data-testid="column-Backlog"]').within(() => {
                        cy.get('[data-testid="create-task-btn"]').should(
                            "be.visible"
                        );
                    });
                });

                it("validates required fields", () => {
                    cy.get('[data-testid="column-Backlog"]').within(() => {
                        cy.get('[data-testid="create-task-btn"]').click();
                    });

                    cy.get('[data-testid="create-task-submit"]').click();
                    cy.get('[data-testid="task-name-input-error"]').should(
                        "be.visible"
                    );
                    cy.contains("Task name is required").should("be.visible");
                });

                it("handles image upload", () => {
                    cy.get('[data-testid="column-Backlog"]').within(() => {
                        cy.get('[data-testid="create-task-btn"]').click();
                    });

                    cy.fixture("test-image.jpg", "base64").then(
                        (fileContent) => {
                            cy.get('[data-testid="image-upload"]').selectFile(
                                {
                                    contents: Cypress.Buffer.from(
                                        fileContent,
                                        "base64"
                                    ),
                                    fileName: "test-image.jpg",
                                    mimeType: "image/jpeg",
                                },
                                { force: true }
                            );
                        }
                    );

                    cy.get('[data-testid="image-preview"]').should(
                        "be.visible"
                    );
                });
            });

            context("When no project is selected", () => {
                it("does not show create task button", () => {
                    cy.visit("/");
                    cy.wait("@getProjects");

                    cy.get('[data-testid="empty-state"]').should("be.visible");
                    cy.get('[data-testid="create-task-btn"]').should(
                        "not.exist"
                    );
                });

                it("shows message to select project first", () => {
                    cy.visit("/");
                    cy.wait("@getProjects");

                    cy.get('[data-testid="empty-state"]').should("be.visible");
                    cy.contains("Create or select a Project to start").should(
                        "be.visible"
                    );
                });
            });

            context(
                "When no projects exist but user wants to create task",
                () => {
                    beforeEach(() => {
                        cy.intercept("GET", "**/projects*", {
                            statusCode: 200,
                            body: { data: [] },
                        }).as("getEmptyProjects");

                        cy.visit("/");
                        cy.wait("@getEmptyProjects");
                    });

                    it("shows create project prompt", () => {
                        cy.get('[data-testid="empty-state"]').should(
                            "be.visible"
                        );
                        cy.contains(
                            "Create or select a Project to start"
                        ).should("be.visible");
                        cy.get(
                            '[data-testid="create-project-btn-desktop"]'
                        ).should("be.visible");
                    });

                    it("creates project and allows task creation", () => {
                        cy.intercept("POST", "**/projects", {
                            statusCode: 201,
                            body: {
                                data: {
                                    gid: "new-project-id",
                                    name: "🚀 New Project",
                                },
                            },
                            delay: 500,
                        }).as("createProject");

                        cy.intercept("GET", "**/projects*", {
                            statusCode: 200,
                            fixture: "createProject.json",
                        }).as("getProjectsUpdated");

                        cy.get(
                            '[data-testid="create-project-btn-desktop"]'
                        ).click();
                        cy.get('[data-testid="project-name-input"]').type(
                            "New Project"
                        );
                        cy.get('[data-testid="logo-option-2"]').click();
                        cy.get('[data-testid="create-project-submit"]').click();

                        cy.wait("@createProject");
                        cy.wait("@getProjectsUpdated");

                        cy.get('[data-testid="project-btn-p1"]').click({
                            force: true,
                        });

                        cy.get('[data-testid="column-Backlog"]').within(() => {
                            cy.get('[data-testid="create-task-btn"]').should(
                                "be.visible"
                            );
                        });
                    });
                }
            );
        });
    });

    context("When no projects exist", () => {
        beforeEach(() => {
            cy.intercept(
                {
                    method: "GET",
                    url: "https://app.asana.com/api/1.0/projects*",
                },
                {
                    statusCode: 200,
                    body: {
                        data: [],
                    },
                }
            ).as("getEmptyProjects");

            cy.visit("/");
            cy.wait("@getEmptyProjects");
        });

        it("should only show the empty state", () => {
            cy.get('[data-testid="sidebar"]').should("be.visible");
            cy.get('[data-testid="project-list"]').should("be.visible");
            cy.get('[data-testid="board"]').should("be.visible");

            cy.get('[data-testid="empty-state"]').should("be.visible");
            cy.contains("Create or select a Project to start").should(
                "be.visible"
            );

            cy.get('[data-testid="project-list"] li').should("have.length", 0);
        });
    });
});
