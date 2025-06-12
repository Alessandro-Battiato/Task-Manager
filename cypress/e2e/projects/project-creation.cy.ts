describe("Project Creation", () => {
    context("When projects exist", () => {
        beforeEach(() => {
            cy.visitWithProjects();

            cy.intercept("GET", "**/projects*", {
                statusCode: 200,
                fixture: "createProject.json",
            }).as("getProjectsUpdated");
        });

        it("should create project successfully", () => {
            cy.intercept("POST", "**/projects", { statusCode: 200 }).as(
                "createProjectSlow"
            );

            cy.get('[data-testid="create-project-btn-desktop"]').click();

            cy.get('[data-testid="project-name-input"]').type(
                "New Test Project"
            );
            cy.get('[data-testid="logo-option-2"]').click();

            cy.get('[data-testid="create-project-submit"]').click();

            cy.wait("@createProjectSlow").then((interception) => {
                expect(interception.request.body).to.have.property("data");
                expect(interception.request.body.data.name).to.equal(
                    "🚀 New Test Project"
                );
            });

            cy.wait("@getProjectsUpdated");
            cy.get('[data-testid="project-list"]').should(
                "contain",
                "🚀 New Test Project"
            );
        });

        it("should prevent multiple submissions", () => {
            let callCount = 0;

            cy.intercept("POST", "**/projects", (req) => {
                callCount++;
                req.reply({
                    statusCode: 201,
                    body: {
                        data: {
                            gid: "mocked-project-id",
                            name: "Test Project",
                        },
                    },
                    delay: 500,
                });
            }).as("createProjectSlow");

            cy.get('[data-testid="create-project-btn-desktop"]').click();
            cy.get('[data-testid="project-name-input"]').type("Test Project");

            cy.get('[data-testid="logo-option-2"]').click();

            cy.get('[data-testid="create-project-submit"]').click();

            cy.get('[data-testid="create-project-submit"]').click({
                force: true,
            });
            cy.get('[data-testid="create-project-submit"]').click({
                force: true,
            });

            cy.wait("@createProjectSlow").then(() => {
                expect(callCount).to.equal(1);
            });
        });
    });
});
