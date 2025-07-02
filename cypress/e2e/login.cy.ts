describe('Login and Create Thread Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('logs in and creates a new thread', () => {
    cy.get('input[name="email"]').type('testa@gmail.com');
    cy.get('input[name="password"]').type('asfasasfsafsa231@F');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');

  });

});
