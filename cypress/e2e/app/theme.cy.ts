describe("Theme Toggle", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();
        });

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

        it("should toggle theme on mobile", () => {
            cy.viewport("iphone-x");

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
});
