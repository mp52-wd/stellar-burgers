/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Пользовательская команда для добавления ингредиента в конструктор
       * @example cy.addIngredient('bun')
       */
      addIngredient(type: string): Chainable<void>

      /**
       * Пользовательская команда для создания заказа
       * @example cy.createOrder()
       */
      createOrder(): Chainable<void>

      /**
       * Пользовательская команда для открытия модального окна ингредиента
       * @example cy.openIngredientModal('bun')
       */
      openIngredientModal(type: string): Chainable<void>
    }
  }
}

// Пользовательская команда для добавления ингредиента в конструктор
Cypress.Commands.add('addIngredient', (type: string) => {
  cy.get(`[data-testid="ingredient-${type}"]`).first().trigger('dragstart')
  cy.get('[data-testid="constructor-drop-zone"]').trigger('drop')
})

// Пользовательская команда для создания заказа
Cypress.Commands.add('createOrder', () => {
  cy.get('[data-testid="order-button"]').click()
})

// Пользовательская команда для открытия модального окна ингредиента
Cypress.Commands.add('openIngredientModal', (type: string) => {
  cy.get(`[data-testid="ingredient-${type}"]`).first().click()
})

export {}
