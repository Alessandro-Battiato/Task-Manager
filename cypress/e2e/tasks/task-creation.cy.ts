describe("Task Creation", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();
        });

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

                cy.get('[data-testid="create-task-submit"]').first().click();
                cy.get('[data-testid="task-name-input-error"]').should(
                    "be.visible"
                );
                cy.contains("Task name is required").should("be.visible");
            });

            it("handles image upload", () => {
                cy.get('[data-testid="column-Backlog"]').within(() => {
                    cy.get('[data-testid="create-task-btn"]').click();
                });

                cy.fixture("test-image.jpg", "base64").then((fileContent) => {
                    cy.get('[data-testid="image-upload"]')
                        .first()
                        .selectFile(
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
                });

                cy.get('[data-testid="image-preview"]').should("be.visible");
            });
        });

        context("When no project is selected", () => {
            it("does not show create task button", () => {
                cy.visit("/");
                cy.wait("@getProjects");

                cy.get('[data-testid="empty-state"]').should("be.visible");
                cy.get('[data-testid="create-task-btn"]').should("not.exist");
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

        context("When no projects exist but user wants to create task", () => {
            beforeEach(() => {
                cy.intercept("GET", "**/projects*", {
                    statusCode: 200,
                    body: { data: [] },
                }).as("getEmptyProjects");

                cy.visit("/");
                cy.wait("@getEmptyProjects");
            });

            it("shows create project prompt", () => {
                cy.get('[data-testid="empty-state"]').should("be.visible");
                cy.contains("Create or select a Project to start").should(
                    "be.visible"
                );
                cy.get('[data-testid="create-project-btn-desktop"]').should(
                    "be.visible"
                );
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

                cy.get('[data-testid="create-project-btn-desktop"]').click();
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
        });
    });
});
