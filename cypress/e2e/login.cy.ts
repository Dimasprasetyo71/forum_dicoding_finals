/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display login page correctly', () => {
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should display alert when email is empty', () => {
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"email" is not allowed to be empty');
    });
  });

  it('should display alert when password is empty', () => {
    cy.get('input[name="email"]').type('testa@gmail.com');
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"password" is not allowed to be empty');
    });
  });

  it('should display alert when email and password are wrong', () => {
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Email or password is wrong');
    });
  });

  it('should display homepage when email and password are correct', () => {
    cy.get('input[name="email"]').type('testa@gmail.com');
    cy.get('input[name="password"]').type('asfasasfsafsa231@F');
    cy.get('button[type="submit"]').click();

    cy.get('button').contains(/^Logout$/).should('be.visible');
  });
});
