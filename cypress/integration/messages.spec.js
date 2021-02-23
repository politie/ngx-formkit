describe('E2E Messages', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="messages"]').as('container');

    cy.get('@container').within(() => {
      cy.get('div[cy-formkit-form]').as('form');
      cy.get('button[submitbutton]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="input"]').as('inputField');
      cy.get('input[ng-reflect-name="input"]').as('input');
      cy.get('input[type=checkbox]').as('checkbox');
    });
  });

  it('Should have a length of 1 by default', () => {
    cy.get('@inputField').within(() => {
      cy.get('[cy-formkit-field-notification]').should('have.length', 1);
    });
  });

  describe('Message check', () => {
    beforeEach(() => {
      cy.get('@checkbox').check({ force: true });
    });

    it('should have a required message', () => {
      cy.get('@inputField').within(() => {
        cy.get('[cy-formkit-field-notification]').should('have.length', 2);
      });
    });

    it('should leave one message when field is filled', () => {
      cy.get('@input').type('123');

      cy.get('@inputField').within(() => {
        cy.get('[cy-formkit-field-notification]').should('have.length', 1);
      });
    });

    it('should leave one message when field is filled', () => {
      cy.get('@input').type('test');

      cy.get('@inputField').within(() => {
        cy.get('[cy-formkit-field-notification]').should('have.length', 2);
      });
    });
  })
});
