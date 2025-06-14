/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("selectProject", (projectId) => {
    cy.get(`[data-testid="${projectId}"]`).click();
});

Cypress.Commands.add("openMobileSidebar", () => {
    cy.get('[data-testid="mobile-menu-button"]').click();
});

Cypress.Commands.add("visitWithProjects", () => {
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

Cypress.Commands.add("setupProjectsAndTasks", (options = {}) => {
    const { tasksFixture = "tasks.json" } = options;

    cy.visitWithProjects();

    cy.intercept(
        {
            method: "GET",
            url: "https://app.asana.com/api/1.0/projects/p1/tasks*",
        },
        {
            statusCode: 200,
            fixture: tasksFixture,
        }
    ).as("getTasksP1");

    cy.intercept(
        {
            method: "GET",
            url: "https://app.asana.com/api/1.0/projects/p2/tasks*",
        },
        {
            statusCode: 200,
            fixture: tasksFixture,
        }
    ).as("getTasksP2");
});
