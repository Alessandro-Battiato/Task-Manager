describe("Task Hive Application", () => {
    beforeEach(() => {
        cy.visit("/");
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
            cy.get('[data-testid="projects-list"]').should("be.visible");
            cy.get('[data-testid="p1"]').should("contain", "Design Board");
            cy.get('[data-testid="p2"]').should("contain", "Learning Board");
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

            cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
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
});
