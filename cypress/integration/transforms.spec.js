describe('E2E Transforms', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="transforms"]').as('container');

    cy.get('@container').within(() => {
      cy.get('.formkit-fields-root').as('form');
      cy.get('button[cy-form-submit-button]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="input"]').as('inputField');
      cy.get('input[ng-reflect-name="input"]').as('input');
      cy.get('input[type=checkbox]').as('checkbox');
    });
  });

  it('The field should be visible', () => {
    cy.get('@button').should('be.enabled');
    cy.get('@inputField').should('be.visible');
  });

  describe('Transforms check', () => {
    it('should be active and user should be able to type', () => {
      cy.get('@input').should('be.enabled').type('test');
      cy.get('@input').should('have.value', 'test');
      cy.get('@checkbox').check({ force: true });
      cy.get('@input').should('be.disabled');
      cy.get('@input').should('have.value', 'Toggle field is active');
      cy.get('@checkbox').uncheck({ force: true });
      cy.get('@input').should('be.enabled').clear();
    });
  });
});
