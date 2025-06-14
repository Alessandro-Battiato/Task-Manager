describe("Task Update", () => {
    context("With existing project and tasks", () => {
        beforeEach(() => {
            cy.intercept("GET", "**/projects/p1/sections*", {
                statusCode: 200,
                body: {
                    data: [
                        { gid: "s1", name: "Backlog" },
                        { gid: "s2", name: "In Progress" },
                        { gid: "s3", name: "Done" },
                    ],
                },
            }).as("getSections");

            cy.setupProjectsAndTasks({ tasksFixture: "updateTask.json" });

            cy.selectProject("p1");
        });

        it("validates when clearing name", () => {
            cy.get('[data-testid="column-Backlog"]')
                .find('[data-testid^="task-card-"]')
                .first()
                .click();

            cy.get('[data-testid="task-name-input"]')
                .first()
                .should("be.visible")
                .clear({ force: true });

            cy.get('[data-testid="update-task-submit"]').click();

            cy.get('[data-testid="task-name-input-error"]').should(
                "be.visible"
            );
            cy.contains("Task name is required").should("be.visible");
        });

        it("updates task name and status", () => {
            cy.get('[data-testid="column-Backlog"]')
                .find('[data-testid^="task-card-"]')
                .first()
                .click();

            cy.intercept("PUT", "**/tasks/t1", (req) => {
                expect(req.body.data).to.include({
                    name: "Updated Task Name",
                });
                req.reply({
                    statusCode: 200,
                    body: {
                        data: { gid: "t1", name: "Updated Task Name" },
                    },
                });
            }).as("updateTask");

            cy.get('[data-testid="task-name-input"]')
                .first()
                .clear({ force: true })
                .type("Updated Task Name");

            cy.get('[data-testid="status-select"]').first().click();

            cy.get('[role="option"]').eq(2).click();

            cy.get('[data-testid="update-task-submit"]').first().click();

            cy.wait("@updateTask");
        });

        it("handles image removal", () => {
            cy.intercept("DELETE", "**/attachments/att1", {
                statusCode: 200,
                body: { data: {} },
            }).as("deleteAttachment");

            cy.get('[data-testid="column-Backlog"]')
                .find('[data-testid^="task-card-"]')
                .first()
                .click();

            cy.get('[data-testid="image-preview"]')
                .first()
                .should("be.visible");

            cy.get('button[aria-label="Remove image"]').first().click();

            cy.get('[data-testid="image-upload"]').first().should("be.visible");

            cy.get('[data-testid="update-task-submit"]').first().click();

            cy.wait("@deleteAttachment");
        });
    });
});
