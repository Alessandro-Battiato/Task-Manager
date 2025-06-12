describe("App Layout", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();
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

        describe("Mobile Responsiveness", () => {
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
