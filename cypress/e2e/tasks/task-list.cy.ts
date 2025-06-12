describe("Board Functionality", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();
        });

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
