describe('Basic fields', () => {
  beforeEach(() => {
    cy.visit('/e2e');
    cy.get('[ng-reflect-title="basic"]').as('container');

    cy.get('@container').within(() => {
      cy.get('form[cy-formkit-form]').as('form');
      cy.get('button[submitbutton]').as('button');
      cy.get('formkit-form-field[ng-reflect-name="input"]').as('textField');
      cy.get('formkit-form-field[ng-reflect-name="checkbox"]').as('checkboxField');
      cy.get('formkit-form-field[ng-reflect-name="array"]').as('arrayField');
      cy.get('formkit-form-field[ng-reflect-name="group"]').as('groupField');
      cy.get('formkit-form-field[ng-reflect-name="radioButtons"]').as('radioButtonField');
      cy.get('formkit-form-field[ng-reflect-name="radio"]').as('radioField');
      cy.get('formkit-form-field[ng-reflect-name="select"]').as('selectField');
      cy.get('formkit-form-field[ng-reflect-name="textarea"]').as('textareaField');
    });
  });

  it('Should render the fields', () => {
    cy.get('@textField').should('be.visible');
    cy.get('@checkboxField').should('be.visible');
    cy.get('@arrayField').should('be.visible');
    cy.get('@groupField').should('be.visible');
    cy.get('@radioButtonField').should('be.visible');
    cy.get('@radioField').should('be.visible');
    cy.get('@selectField').should('be.visible');
    cy.get('@textareaField').should('be.visible');
    cy.get('@button').should('be.enabled');
  });

  it('should handle text field', () => {
    cy.get('@textField').within(() => {
      cy.get('input[matInput]').type('test');
    });
  });

  it('should handle checkbox field', () => {
    cy.get('@checkboxField').within(() => {
      cy.get('input[type=checkbox]').check({force: true });
    });
  });

  it('should handle array field', () => {
    cy.get('@arrayField').within(() => {
      cy.get('input[matInput]').type('test');
    });
  });

  it('should handle group field', () => {
    cy.get('@groupField').within(() => {
      cy.get('input[matInput]').type('test');
      cy.get('input[type=checkbox]').check({force: true });
    });
  });

  it('should handle radio buttons field', () => {
    cy.get('@radioButtonField').within(() => {
      cy.get('input[type=radio]').first().check({ force: true });
      cy.get('input[type=radio]').last().check({ force: true });
    });
  });

  it('should handle radio field', () => {
    cy.get('@radioField').within(() => {
      cy.get('input[type=radio]').first().check({ force: true });
      cy.get('input[type=radio]').last().check({ force: true });
    });
  });

  it('should handle select field', () => {
    cy.get('@selectField').within(() => {
      cy.get('select').select('Label 2');
    });
  });

  it('should handle textarea field', () => {
    cy.get('@textareaField').within(() => {
      cy.get('textarea').type('test');
    });
  });
});
