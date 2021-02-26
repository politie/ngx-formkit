describe('E2E Required', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="required"]').as('container');

    cy.get('@container').within(() => {
      cy.get('div[cy-formkit-form]').as('form');
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

  describe('Required check', () => {
    beforeEach(() => {
      cy.get('@checkbox').check({ force: true });
    });

    it('should make the field required', () => {
      cy.get('@button').should('be.disabled');
    });
  });
});
