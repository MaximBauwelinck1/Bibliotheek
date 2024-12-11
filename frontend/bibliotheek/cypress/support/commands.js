Cypress.Commands.add('login', (email, password) => {

  Cypress.log({
    displayName: 'login',
  });
  
  cy.visit('http://localhost:5173/login'); 
  
  cy.get('[data-cy=email_input]').clear(); 
  cy.get('[data-cy=email_input]').type(email); 
  
  cy.get('[data-cy=password_input]').clear(); 
  cy.get('[data-cy=password_input]').type(password); 
  
  cy.get('[data-cy=submit_btn]').click(); 
});
  
Cypress.Commands.add('logout', () => {
  Cypress.log({
    displayName: 'logout',
  });
  
  cy.get('[data-cy=profiel]').click();
  cy.get('[data-cy=logout]').click();
});