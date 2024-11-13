import { CreateSnippet } from "../../src/utils/snippet";

describe("Home", () => {
  beforeEach(() => {
    cy.loginToAuth0(
      Cypress.env("AUTH0_USERNAME"),
      Cypress.env("AUTH0_PASSWORD")
    );
  });
  before(() => {
    process.env.FRONTEND_URL = Cypress.env("FRONTEND_URL");
    process.env.BACKEND_URL = Cypress.env("BACKEND_URL");
  });
  it("Renders home", () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    /* ==== Generated with Cypress Studio ==== */
    cy.get(".MuiTypography-h6").should("have.text", "Printscript");
    cy.get(".MuiBox-root > .MuiInputBase-root > .MuiInputBase-input").should(
      "be.visible"
    );
    cy.get(".css-9jay18 > .MuiButton-root").should("be.visible");
    cy.get(".css-jie5ja").click();
    /* ==== End Cypress Studio ==== */
  });

  // You need to have at least 1 snippet in your DB for this test to pass
  it("Renders the first snippets", () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    const first10Snippets = cy.get('[data-testid="snippet-row"]');

    first10Snippets.should("have.length.greaterThan", 0);

    first10Snippets.should("have.length.lessThan", 10);
  });

  it("Can creat snippet find snippets by name", () => {
    cy.visit(Cypress.env("FRONTEND_URL"));
    const snippetData: CreateSnippet = {
      name: "Test name",
      content: "println(1);",
      language: "printscript",
      extension: ".ps",
    };

    cy.intercept("GET", Cypress.env("BACKEND_URL") + "/snippet*", (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.eq(200);
      });
    }).as("getSnippets");

    cy.request({
      method: "POST",
      url: Cypress.env("BACKEND_URL") + "/snippet", // Adjust if you have a different base URL configured in Cypress
      body: snippetData,
      failOnStatusCode: false, // Optional: set to true if you want the test to fail on non-2xx status codes
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authAccessToken")}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      cy.get(".MuiBox-root > .MuiInputBase-root > .MuiInputBase-input").clear();
      cy.get(".MuiBox-root > .MuiInputBase-root > .MuiInputBase-input").type(
        snippetData.name + "{enter}"
      );
      cy.wait("@getSnippets");
      cy.contains(snippetData.name).should("exist");
    });
  });
});
