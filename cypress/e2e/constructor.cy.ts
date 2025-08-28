describe('Constructor Page', () => {
  beforeEach(() => {
    // Перехватываем все API запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients')
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser')
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder')

    // Устанавливаем фейковые токены авторизации в localStorage и cookie
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'fake-access-token')
      win.localStorage.setItem('refreshToken', 'fake-refresh-token')
    })

    // Устанавливаем токен в cookie
    cy.setCookie('accessToken', 'fake-access-token')

    cy.visit('/')
    cy.wait('@getIngredients')
  })

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.window().then((win) => {
      win.localStorage.removeItem('accessToken')
      win.localStorage.removeItem('refreshToken')
    })
    cy.clearCookie('accessToken')
  })

  describe('Adding ingredients to constructor', () => {
    it('should add bun to constructor', () => {
      // Проверяем, что булки нет в конструкторе
      cy.get('[data-testid="constructor-bun"]').should('not.exist')

      // Добавляем булку в конструктор
      cy.get('[data-testid="ingredient-bun"]').first().find('button').click({ force: true })

      // Проверяем, что булка добавлена и это именно та булка, которую мы выбрали
      cy.get('[data-testid="constructor-bun"]').should('exist')
      cy.get('[data-testid="constructor-bun"]').should('contain', 'Краторная булка N-200i')
    })

    it('should add main ingredient to constructor', () => {
      // Проверяем, что начинки нет в конструкторе
      cy.get('[data-testid="constructor-main"]').should('not.exist')

      // Добавляем начинку в конструктор
      cy.get('[data-testid="ingredient-main"]').first().find('button').click({ force: true })

      // Проверяем, что начинка добавлена и это именно та начинка, которую мы выбрали
      cy.get('[data-testid="constructor-main"]').should('exist')
      cy.get('[data-testid="constructor-main"]').should('contain', 'Биокотлета из марсианской Магнолии')
    })

    it('should add sauce to constructor', () => {
      // Проверяем, что соуса нет в конструкторе
      cy.get('[data-testid="constructor-sauce"]').should('not.exist')

      // Добавляем соус в конструктор
      cy.get('[data-testid="ingredient-sauce"]').first().find('button').click({ force: true })

      // Проверяем, что соус добавлен и это именно тот соус, который мы выбрали
      cy.get('[data-testid="constructor-sauce"]').should('exist')
      cy.get('[data-testid="constructor-sauce"]').should('contain', 'Соус фирменный Space Sauce')
    })
  })

  describe('Modal windows', () => {
    it('should open ingredient modal when clicking on ingredient', () => {
      // Открываем модальное окно ингредиента
      cy.get('[data-testid="ingredient-bun"]').first().find('a').click({ force: true })

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="ingredient-modal"]').should('exist')

      // Проверяем, что отображается правильный ингредиент
      cy.get('[data-testid="ingredient-modal"]').should('contain', 'Краторная булка N-200i')
    })

    it('should close ingredient modal when clicking on close button', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-bun"]').first().find('a').click({ force: true })
      cy.get('[data-testid="ingredient-modal"]').should('exist')

      // Закрываем по клику на крестик
      cy.get('[data-testid="modal-close"]').click({ force: true })

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="ingredient-modal"]').should('not.exist', { timeout: 10000 })
    })

    it('should close ingredient modal when clicking on overlay', () => {
      // Открываем модальное окно
      cy.get('[data-testid="ingredient-bun"]').first().find('a').click({ force: true })
      cy.get('[data-testid="ingredient-modal"]').should('exist')

      // Закрываем по клику на оверлей
      cy.get('[data-testid="modal-overlay"]').click({ force: true })

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="ingredient-modal"]').should('not.exist')
    })
  })

  describe('Order creation', () => {
    it('should create order successfully', () => {
      // Проверяем, что ингредиентов нет в конструкторе
      cy.get('[data-testid="constructor-bun"]').should('not.exist')
      cy.get('[data-testid="constructor-main"]').should('not.exist')

      // Добавляем ингредиенты в конструктор
      cy.get('[data-testid="ingredient-bun"]').first().find('button').click({ force: true })
      cy.get('[data-testid="ingredient-main"]').first().find('button').click({ force: true })

      // Ждем, пока ингредиенты добавятся
      cy.wait(1000)

      // Проверяем, что ингредиенты добавлены и это именно те ингредиенты, которые мы выбрали
      cy.get('[data-testid="constructor-bun"]').should('exist')
      cy.get('[data-testid="constructor-main"]').should('exist')

      cy.get('[data-testid="constructor-bun"]').should('contain', 'Краторная булка N-200i')
      cy.get('[data-testid="constructor-main"]').should('contain', 'Биокотлета из марсианской Магнолии')

      // Проверяем, что кнопка "Оформить заказ" активна
      cy.get('[data-testid="order-button"]').should('not.be.disabled')

      // Отладочная информация
      cy.log('Кнопка "Оформить заказ" активна, кликаем по ней')

      // Создаем заказ
      cy.get('[data-testid="order-button"]').click()

      // Отладочная информация
      cy.log('Клик по кнопке выполнен, ожидаем API запроса')

      // Ждем API запроса создания заказа
      cy.wait('@createOrder')

      // Отладочная информация
      cy.log('API запрос выполнен, ожидаем появления модального окна заказа')

      // Ждем появления модального окна заказа
      cy.get('[data-testid="order-modal"]', { timeout: 10000 }).should('exist')

      // Отладочная информация
      cy.log('Проверяем, что модальное окно заказа существует')

      // Проверяем, что номер заказа верный
      cy.get('[data-testid="order-number"]').should('contain', '12345')

      // Закрываем модальное окно
      cy.get('[data-testid="modal-close"]').click()

      // Проверяем, что модальное окно закрылось
      cy.get('[data-testid="order-modal"]').should('not.exist')

      // Проверяем, что конструктор пуст
      cy.get('[data-testid="constructor-main"]').should('not.exist')
      cy.get('[data-testid="constructor-sauce"]').should('not.exist')
    })
  })
})
