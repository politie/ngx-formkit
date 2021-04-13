describe('E2E Disabled', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="disabled"]').as('container');

    cy.get('@container').within(() => {
      cy.get('.formkit-fields-root').as('form');
      cy.get('button[cy-form-submit-button]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="text"]').as('inputField');
      cy.get('input[ng-reflect-name="text"]').as('input');
      cy.get('input[type=checkbox]').as('checkbox');
    });
  });

  it('The field should be enabled by default', () => {
    cy.get('@input').should('be.enabled');
  });

  describe('Disabled check', () => {
    beforeEach(() => {
      cy.get('@checkbox').check({ force: true });
    });

    it('should disable the input field', () => {
      cy.get('@input').should('be.disabled');
    });

    it('should enable the input again', () => {
      cy.get('@checkbox').check({ force: true });
      cy.get('@input').should('be.enabled');
    })
  });
});
