import { Task } from "../../../src/types/task";

describe("Task Deletion", () => {
    context("When tasks exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();
            cy.setupProjectsAndTasks();

            cy.intercept("GET", "**/tags*", {
                statusCode: 200,
                body: { data: [] },
            }).as("getTags");

            cy.intercept("GET", "**/projects/*/sections*", {
                statusCode: 200,
                body: {
                    data: [
                        { gid: "s1", name: "Backlog" },
                        { gid: "s2", name: "In Progress" },
                        { gid: "s3", name: "In Review" },
                        { gid: "s4", name: "Done" },
                    ],
                },
            }).as("getSections");

            cy.selectProject("project-btn-p1");
            cy.wait("@getTasksP1");
        });

        it("should delete a task and update the UI", () => {
            cy.intercept("DELETE", "**/tasks/1", {
                statusCode: 200,
            }).as("deleteTask");

            cy.get('[data-testid="task-card-1"]').should("exist");
            cy.get('[data-testid="task-card-1"]').should(
                "contain",
                "Design new landing page"
            );

            cy.get('[data-testid="delete-task-1"]').click();

            cy.contains("Are you sure you want to delete the task").should(
                "be.visible"
            );
            cy.contains("Design new landing page").should("be.visible");

            cy.get('[data-testid="confirm-delete-btn"]:visible')
                .first()
                .click();

            cy.wait("@deleteTask");

            cy.fixture("tasks.json").then((tasks) => {
                const updatedTasks = {
                    data: tasks.data.filter((task: Task) => task.gid !== "1"),
                };

                cy.intercept("GET", "**/projects/p1/tasks*", {
                    statusCode: 200,
                    body: updatedTasks,
                }).as("getTasksAfterDelete");
            });

            cy.reload();
            cy.wait("@getProjects");
            cy.selectProject("project-btn-p1");
            cy.wait("@getTasksAfterDelete");

            cy.get('[data-testid="task-card-1"]').should("not.exist");

            cy.get('[data-testid="task-card-2"]').should("exist");
            cy.get('[data-testid="task-card-3"]').should("exist");
        });

        it("should update task counters after deletion", () => {
            cy.get('[data-testid="column-Backlog"]')
                .find('[data-testid="status-badge"]')
                .should("contain", "Backlog");

            cy.intercept("DELETE", "**/tasks/1", {
                statusCode: 200,
            }).as("deleteBacklogTask");

            cy.get('[data-testid="delete-task-1"]').click();
            cy.get('[data-testid="confirm-delete-btn"]:visible')
                .first()
                .click();
            cy.wait("@deleteBacklogTask");

            cy.fixture("tasks.json").then((tasks) => {
                const updatedTasks = {
                    data: tasks.data.filter((task: Task) => task.gid !== "1"),
                };

                cy.intercept("GET", "**/projects/p1/tasks*", {
                    statusCode: 200,
                    body: updatedTasks,
                }).as("getTasksAfterDelete");
            });

            cy.reload();
            cy.wait("@getProjects");
            cy.selectProject("project-btn-p1");
            cy.wait("@getTasksAfterDelete");

            cy.get('[data-testid="column-Backlog"]')
                .find('[data-testid="status-badge"]')
                .should("contain", "Backlog");
        });
    });
});
