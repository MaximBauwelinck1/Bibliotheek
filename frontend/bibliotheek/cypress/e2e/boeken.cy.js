describe('Boeken lijst', () => {
  it('moet een lijst van boeken tonen', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/boeken',
      { fixture: 'boeken.json' },
    );
  
    cy.visit('http://localhost:5173');
    cy.get('[data-cy=boek_grid]') 
      .children()
      .should('have.length', 2);
    cy.get('[data-cy=boek_grid]').children().eq(0)
      .find('[data-cy=titel]') 
      .should('have.text', 'Brave New World');
    cy.get('[data-cy=boek_grid]').children().eq(1)
      .find('[data-cy=titel]') 
      .should('have.text', 'Fahrenheit 451');

    cy.get('[data-cy=boek_grid]').children().eq(0)
      .find('[data-cy=auteur]') 
      .should('have.text', 'George Orwell');
    cy.get('[data-cy=boek_grid]').children().eq(1)
      .find('[data-cy=auteur]') 
      .should('have.text', 'Ray Bradbury');
  });

  it('op een niet bestaand boek filteren', () => {
    cy.visit('http://localhost:5173/boeken'); 

    cy.get('[data-cy=zoektxt]').type('nietbestaandboekkkkkk!!!!!!');
    cy.get('[data-cy=filter]').click();
    cy.get('[data-cy=boek_grid]') 
      .children() 
      .should('have.length', 0);
  });

  it('letter b in het zoekveld typen moet 4 boeken teruggeven', () => {
    cy.visit('http://localhost:5173/boeken'); 

    cy.get('[data-cy=zoektxt]').type('b');
    cy.get('[data-cy=filter]').click();
    cy.get('[data-cy=boek_grid]') 
      .children() 
      .should('have.length', 4);
  });

  it('op frans filteren en er moet 1 boek overblijven', () => {
    cy.visit('http://localhost:5173/boeken'); 

    cy.get('[data-cy=taalselect]').select('Frans');
    cy.get('[data-cy=filter]').click();
    cy.get('[data-cy=boek_grid]') 
      .children() 
      .should('have.length', 1);
  });

  it('een boek bekijken', () => {
    cy.visit('http://localhost:5173/boeken/84b51ee1-8a96-4c1b-bc1e-b1e97b1c8c90'); 

    cy.get('[data-cy=auteurlbl]');
    cy.get('[data-cy=taallbl]');
  });

  it('loading bar tonen met een trage response', () => {
   
    cy.intercept(
      'http://localhost:9000/api/boeken', 
      (req) => {
        req.on('response', (res) => {
          res.setDelay(1000);
        });
      },
    ).as('slowResponse'); 
    cy.visit('http://localhost:5173'); 
    cy.get('[data-cy=loading]').should('be.visible'); 
    cy.wait('@slowResponse'); 
    cy.get('[data-cy=loading]').should('not.exist');
  });
});