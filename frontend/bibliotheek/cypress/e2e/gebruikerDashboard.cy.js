describe('Admin dashboard voor users te managen', () => {
  beforeEach(() => {
    cy.login('jane.smith@example.com', 'admin1'); 
  });
  afterEach(() => {
    
  });
  it('laad de pagina correct', () => {
    cy.wait(5000);
    cy.get('[data-cy=dashboard]').click();
    cy.get('[data-cy=gebruiker_btn]').click();
    cy.get('h2').should('exist');
    cy.get('tbody')
      .children('tr')
      .eq(0)
      .find('td')
      .eq(1) 
      .should('contain', 'Jane');
    cy.get('tbody')
      .children('tr')
      .eq(1)
      .find('td')
      .eq(1) 
      .should('contain', 'John');
  });

  it('laad de pagina correct met fake data', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/gebruikers',
      { fixture: 'gebruikers.json' },
    );
    cy.wait(5000);
    cy.get('[data-cy=dashboard]').click();
    cy.get('[data-cy=gebruiker_btn]').click();
   
    cy.get('h2').should('exist');
    cy.get('tbody')
      .children('tr')
      .eq(0)
      .find('td')
      .eq(1) 
      .should('contain', 'TESTVOORNAAM');
  });
  it('Bekijk een gebruiker', () => {
    cy.wait(5000);
    cy.get('[data-cy=dashboard]').click();
    cy.get('[data-cy=gebruiker_btn]').click();
    cy.get('h2').should('exist');
    cy.get('tbody')
      .children('tr')
      .eq(1)
      .find('[data-cy=opt_menu]').click();
    cy.get('tbody')
      .children('tr') 
      .eq(1) 
      .find('[data-cy=opt_menu]') 
      .siblings() 
      .find('[data-cy=bekijk]') 
      .click();
    cy.get('[data-cy=naam]') .should('have.text', 'John Doe');
    cy.get('[data-cy=email]') .should('have.text', 'Email: john.doe@example.com');

  });
  /*
  it('zet een gebruiker op niet-actief', () => {
    cy.wait(5000);
    cy.get('[data-cy=dashboard]').click();
    cy.get('[data-cy=gebruiker_btn]').click();
    cy.get('h2').should('exist');
    cy.get('tbody')
      .children('tr')
      .eq(1)
      .find('[data-cy=opt_menu]').click();
    cy.get('tbody')
      .children('tr') 
      .eq(1) 
      .find('[data-cy=opt_menu]') 
      .siblings() 
      .find('[data-cy=delete]') 
      .click();
    cy.get('[data-cy=bevestig]').click();

    cy.get('tbody').children('tr').should('have.length', 1);
  });
  */
  /*uncommenten wanneer ik user manueel kan activeren
  it('zet de gebruiker terug op actief', () => {
    cy.wait(5000);
    cy.get('[data-cy=dashboard]').click();
    cy.get('[data-cy=gebruiker_btn]').click();
    cy.get('h2').should('exist');
    cy.get('[data-cy=toon_deleted]').click();
    cy.get('tbody')
      .children('tr')
      .eq(1)
      .find('[data-cy=opt_menu]').click();
    cy.get('tbody')
      .children('tr') 
      .eq(1) 
      .find('[data-cy=opt_menu]') 
      .siblings() 
      .find('[data-cy=edit]') 
      .click();
  });
  */
});
  