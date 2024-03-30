/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable jest/expect-expect */
/* eslint-disable no-undef */
/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('Coin App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
  });

  function login() {
    cy.get('input[type=text]').type('developer');
    cy.get('input[type=password]').type('skillbox');
    cy.contains('Войти').click();
  }
  it('Авторизоваться в приложений', () => {
    login();
    cy.get('.account-card').should('be.ok');
    cy.get('.account-card').should('have.length.greaterThan', 1);
  });
  it('Добавить новый счет', () => {
    login();
    cy.contains('Создать новый счёт').click();
    cy.get('.account-card').should('have.length.greaterThan', 2);
  });
  it('Совершить перевод со счета', () => {
    login();
    cy.contains('Открыть').first().click();
    cy.get('input[type=text]').type('24044006110405761178070104');
    cy.get('input[type=number]').type('1000');
    cy.contains('Отправить').click();
  });
});
