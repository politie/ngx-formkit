describe('E2E Hidden', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="hidden"]').as('container');

    cy.get('@container').within(() => {
      cy.get('form[cy-formkit-form]').as('form');
      cy.get('button[submitbutton]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="input"]').as('inputField');
      cy.get('input[ng-reflect-name="input"]').as('input');
      cy.get('input[type=checkbox]').as('checkbox');
    });
  });

  it('The field should be visible by default', () => {
    cy.get('@inputField').should('be.visible');
  });

  describe('Hidden check', () => {
    beforeEach(() => {
      cy.get('@checkbox').check({ force: true });
    });

    it('should hide the input field', () => {
      cy.get('@inputField').should('not.be.visible');
    });
  });
});
