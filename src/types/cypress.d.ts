export {};

declare global {
    namespace Cypress {
        interface Chainable {
            selectProject(projectId: string): Chainable<void>;
            openMobileSidebar(): Chainable<void>;
            visitWithProjects(): Chainable<void>;
            setupProjectsAndTasks(): Chainable<void>;
        }
    }
}
