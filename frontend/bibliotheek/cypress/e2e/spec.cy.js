describe('General', () => {
  it('draait de applicatie', () => {
    cy.visit('http://localhost:5173'); 
    cy.get('h1').should('exist');
  });
  it('should login', () => {
    cy.login('jane.smith@example.com', 'admin1'); 
  });
  it('should login and logout after', () => {
    cy.login('jane.smith@example.com', 'admin1'); 
    cy.wait(5500);
    cy.logout();
  });
});