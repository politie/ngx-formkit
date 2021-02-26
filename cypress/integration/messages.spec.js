describe('E2E Messages', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="messages"]').as('container');

    cy.get('@container').within(() => {
      cy.get('div[cy-formkit-form]').as('form');
      cy.get('button[cy-form-submit-button]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="input"]').as('inputField');
      cy.get('input[ng-reflect-name="input"]').as('input');
    });
  });

  it('Should have a length of 1 by default', () => {
    cy.get('@inputField').within(() => {
      cy.get('[cy-formkit-field-notification]').should('have.length', 1);
    });
  });

  describe('Message check', () => {
    it('should leave one message when field is filled', () => {
      cy.get('@input').type('test');

      cy.get('@inputField').within(() => {
        cy.get('[cy-formkit-field-notification]')
          .should('have.length', 1)
          .should('have.text', 'You have entered 4 characters.')
      });
    });
  })
});
