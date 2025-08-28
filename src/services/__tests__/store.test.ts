import store from '../store';
import { configureStore } from '@reduxjs/toolkit';
import constructorReducer from '../slices/constructor';
import ingredientsReducer from '../slices/ingredients';
import newOrderReducer from '../slices/newOrder';
import userReducer from '../slices/user';
import passwordReducer from '../slices/password';
import ordersReducer from '../slices/orders';
import feedsReducer from '../slices/feeds';

// Создаем тестовый store только с нужными слайсами
const testStore = configureStore({
  reducer: {
    burgerConstructor: constructorReducer,
    ingredients: ingredientsReducer,
    newOrder: newOrderReducer,
    user: userReducer,
    password: passwordReducer,
    orders: ordersReducer,
    feeds: feedsReducer
  },
  devTools: false
});

describe('Store Configuration', () => {
  it('should initialize with correct initial state', () => {
    const state = testStore.getState();

    // Проверяем, что все слайсы присутствуют
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('newOrder');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('password');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feeds');
  });

  it('should handle unknown action correctly', () => {
    const initialState = testStore.getState();

    // Отправляем неизвестный экшен
    testStore.dispatch({ type: 'UNKNOWN_ACTION' });

    const newState = testStore.getState();

    // Состояние должно остаться неизменным
    expect(newState).toEqual(initialState);
  });

  it('should have correct initial state structure', () => {
    const state = testStore.getState();

    // Проверяем структуру слайса constructor
    expect(state.burgerConstructor).toHaveProperty('bun');
    expect(state.burgerConstructor).toHaveProperty('ingredients');

    // Проверяем структуру слайса ingredients
    expect(state.ingredients).toHaveProperty('ingredients');
    expect(state.ingredients).toHaveProperty('loading');
    expect(state.ingredients).toHaveProperty('error');

    // Проверяем структуру слайса newOrder
    expect(state.newOrder).toHaveProperty('order');
    expect(state.newOrder).toHaveProperty('loading');
    expect(state.newOrder).toHaveProperty('error');

    // Проверяем структуру слайса user
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('isAuthenticated');
    expect(state.user).toHaveProperty('data');

    // Проверяем структуру слайса password
    expect(state.password).toHaveProperty('loading');
    expect(state.password).toHaveProperty('error');
    expect(state.password).toHaveProperty('isResetEmailSent');
    expect(state.password).toHaveProperty('isPasswordReset');

    // Проверяем структуру слайса orders
    expect(state.orders).toHaveProperty('orders');
    expect(state.orders).toHaveProperty('loading');
    expect(state.orders).toHaveProperty('error');

    // Проверяем структуру слайса feeds
    expect(state.feeds).toHaveProperty('feeds');
    expect(state.feeds).toHaveProperty('loading');
    expect(state.feeds).toHaveProperty('error');
  });
});

describe('Root Reducer', () => {
  it('should return correct initial state when called with undefined state and unknown action', () => {
    const initialState = testStore.getState();

    // Проверяем, что rootReducer возвращает корректное начальное состояние
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('newOrder');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('password');
    expect(initialState).toHaveProperty('burgerConstructor');

    // Проверяем начальные значения для каждого слайса
    expect(initialState.ingredients.ingredients).toEqual([]);
    expect(initialState.ingredients.loading).toBe(false);
    expect(initialState.ingredients.error).toBe(null);

    expect(initialState.burgerConstructor.bun).toBe(null);
    expect(initialState.burgerConstructor.ingredients).toEqual([]);

    expect(initialState.newOrder.order).toBe(null);
    expect(initialState.newOrder.loading).toBe(false);
    expect(initialState.newOrder.error).toBe(null);

    expect(initialState.user.isAuthChecked).toBe(false);
    expect(initialState.user.isAuthenticated).toBe(false);
    expect(initialState.user.data).toBe(null);

    expect(initialState.password.loading).toBe(false);
    expect(initialState.password.error).toBe(null);
    expect(initialState.password.isResetEmailSent).toBe(false);
    expect(initialState.password.isPasswordReset).toBe(false);

    expect(initialState.orders.orders).toEqual([]);
    expect(initialState.orders.loading).toBe(false);
    expect(initialState.orders.error).toBe(null);

    expect(initialState.feeds.feeds).toBe(null);
    expect(initialState.feeds.loading).toBe(false);
    expect(initialState.feeds.error).toBe(null);
  });

  it('should handle unknown action without changing state', () => {
    const initialState = testStore.getState();
    testStore.dispatch({ type: 'ANOTHER_UNKNOWN_ACTION' });
    const newState = testStore.getState();

    // Состояние должно остаться неизменным
    expect(newState).toEqual(initialState);
  });
});
