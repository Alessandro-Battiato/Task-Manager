import { Project } from "../../../src/types/project";

describe("Project Deletion", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();

            cy.setupProjectsAndTasks();
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
                    data: projects.data.filter((p: Project) => p.gid !== "p1"),
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
});
