import feedsReducer, { fetchFeeds } from '../index';
import { AnyAction } from '@reduxjs/toolkit';

describe('Feeds Slice', () => {
  const initialState = {
    feeds: null,
    loading: false,
    error: null
  };

  const mockFeeds = {
    orders: [
      {
        _id: '12345',
        ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093d'],
        status: 'done',
        name: 'Биокотлета из марсианской Магнолии',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        number: 12345
      },
      {
        _id: '67890',
        ingredients: ['643d69a5c3f7b9001cfa093e'],
        status: 'pending',
        name: 'Соус фирменный Space Sauce',
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        number: 67890
      }
    ],
    total: 2,
    totalToday: 1
  };

  describe('Initial State', () => {
    it('should return initial state', () => {
      expect(feedsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    it('should have correct initial state structure', () => {
      expect(initialState).toEqual({
        feeds: null,
        loading: false,
        error: null
      });
    });
  });

  describe('Request Action', () => {
    it('should set loading to true when fetching feeds', () => {
      const action = { type: fetchFeeds.pending.type } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBe(null);
      expect(newState.feeds).toBe(null);
    });

    it('should preserve existing feeds when starting new request', () => {
      const stateWithFeeds = {
        ...initialState,
        feeds: mockFeeds,
        loading: false
      };

      const action = { type: fetchFeeds.pending.type } as AnyAction;
      const newState = feedsReducer(stateWithFeeds, action);

      expect(newState.loading).toBe(true);
      expect(newState.feeds).toEqual(mockFeeds); // Лента сохраняется
      expect(newState.error).toBe(null);
    });
  });

  describe('Success Action', () => {
    it('should set feeds and set loading to false on successful fetch', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction;
      const newState = feedsReducer(loadingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.feeds).toEqual(mockFeeds);
      expect(newState.error).toBe(null);
    });

    it('should replace existing feeds with new feeds', () => {
      const stateWithOldFeeds = {
        ...initialState,
        feeds: { orders: [], total: 0, totalToday: 0 },
        loading: true
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction;
      const newState = feedsReducer(stateWithOldFeeds, action);

      expect(newState.feeds).toEqual(mockFeeds);
      expect(newState.feeds).not.toEqual({
        orders: [],
        total: 0,
        totalToday: 0
      });
    });

    it('should handle empty feeds data', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const emptyFeeds = { orders: [], total: 0, totalToday: 0 };
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: emptyFeeds
      } as AnyAction;
      const newState = feedsReducer(loadingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.feeds).toEqual(emptyFeeds);
      expect(newState.error).toBe(null);
    });
  });

  describe('Failed Action', () => {
    it('should set error and set loading to false on failed fetch', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      } as AnyAction;
      const newState = feedsReducer(loadingState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Failed to fetch feeds');
      expect(newState.feeds).toBe(null);
    });

    it('should preserve existing feeds when request fails', () => {
      const stateWithFeeds = {
        ...initialState,
        feeds: mockFeeds,
        loading: true
      };

      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      } as AnyAction;
      const newState = feedsReducer(stateWithFeeds, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Failed to fetch feeds');
      expect(newState.feeds).toEqual(mockFeeds); // Лента сохраняется
    });

    it('should handle different error types', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const networkError = 'Network Error';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: networkError }
      } as AnyAction;
      const newState = feedsReducer(loadingState, action);

      expect(newState.error).toBe(networkError);
    });

    it('should handle error without message', () => {
      const loadingState = {
        ...initialState,
        loading: true
      };

      const action = { type: fetchFeeds.rejected.type, error: {} } as AnyAction;
      const newState = feedsReducer(loadingState, action);

      expect(newState.error).toBe('Ошибка загрузки'); // fallback значение из слайса
      expect(newState.loading).toBe(false);
    });
  });

  describe('State Transitions', () => {
    it('should handle complete request cycle: pending -> fulfilled', () => {
      let state = feedsReducer(initialState, {
        type: fetchFeeds.pending.type
      } as AnyAction);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction);
      expect(state.loading).toBe(false);
      expect(state.feeds).toEqual(mockFeeds);
      expect(state.error).toBe(null);
    });

    it('should handle complete request cycle: pending -> rejected', () => {
      let state = feedsReducer(initialState, {
        type: fetchFeeds.pending.type
      } as AnyAction);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      state = feedsReducer(state, {
        type: fetchFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      } as AnyAction);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch feeds');
      expect(state.feeds).toBe(null);
    });

    it('should handle multiple requests correctly', () => {
      let state: any = initialState;

      // Первый запрос
      state = feedsReducer(state, {
        type: fetchFeeds.pending.type
      } as AnyAction);
      expect(state.loading).toBe(true);

      // Первый запрос завершается успешно
      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction);
      expect(state.loading).toBe(false);
      expect(state.feeds).toEqual(mockFeeds);

      // Второй запрос
      state = feedsReducer(state, {
        type: fetchFeeds.pending.type
      } as AnyAction);
      expect(state.loading).toBe(true);
      expect(state.feeds).toEqual(mockFeeds); // Лента сохраняется

      // Второй запрос завершается с ошибкой
      state = feedsReducer(state, {
        type: fetchFeeds.rejected.type,
        error: { message: 'Failed to fetch feeds' }
      } as AnyAction);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch feeds');
      expect(state.feeds).toEqual(mockFeeds); // Лента все еще сохраняется
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined action payload gracefully', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: undefined
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.feeds).toEqual(undefined);
      expect(newState.loading).toBe(false);
    });

    it('should handle null error gracefully', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: null
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.error).toBe('Ошибка загрузки'); // fallback значение из слайса
      expect(newState.loading).toBe(false);
    });

    it('should handle feeds with different total values', () => {
      const feedsWithDifferentTotals = {
        ...mockFeeds,
        total: 100,
        totalToday: 25
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: feedsWithDifferentTotals
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.feeds).toEqual(feedsWithDifferentTotals);
      expect(newState.feeds?.total).toBe(100);
      expect(newState.feeds?.totalToday).toBe(25);
    });
  });

  describe('Data Integrity', () => {
    it('should preserve feeds structure', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.feeds).toHaveProperty('orders');
      expect(newState.feeds).toHaveProperty('total');
      expect(newState.feeds).toHaveProperty('totalToday');
      expect(Array.isArray(newState.feeds?.orders)).toBe(true);
      expect(typeof newState.feeds?.total).toBe('number');
      expect(typeof newState.feeds?.totalToday).toBe('number');
    });

    it('should handle feeds with missing optional fields', () => {
      const feedsWithMissingFields = {
        orders: mockFeeds.orders
        // Отсутствуют total и totalToday
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: feedsWithMissingFields
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.feeds).toEqual(feedsWithMissingFields);
      expect(newState.feeds).not.toHaveProperty('total');
      expect(newState.feeds).not.toHaveProperty('totalToday');
    });

    it('should handle feeds with empty orders array', () => {
      const feedsWithEmptyOrders = {
        orders: [],
        total: 0,
        totalToday: 0
      };

      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: feedsWithEmptyOrders
      } as AnyAction;
      const newState = feedsReducer(initialState, action);

      expect(newState.feeds).toEqual(feedsWithEmptyOrders);
      expect(newState.feeds?.orders).toHaveLength(0);
    });
  });

  describe('Real-time Updates', () => {
    it('should handle feeds updates with new orders', () => {
      // Сначала загружаем начальную ленту
      let state = feedsReducer(initialState, {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeeds
      } as AnyAction);
      expect(state.feeds?.orders).toHaveLength(2);

      // Затем обновляем с новыми заказами
      const updatedFeeds = {
        ...mockFeeds,
        orders: [
          ...mockFeeds.orders,
          {
            _id: '99999',
            ingredients: ['643d69a5c3f7b9001cfa093c'],
            status: 'created',
            name: 'New Order',
            createdAt: '2024-01-03T00:00:00.000Z',
            updatedAt: '2024-01-03T00:00:00.000Z',
            number: 99999
          }
        ],
        total: 3,
        totalToday: 2
      };

      state = feedsReducer(state, {
        type: fetchFeeds.fulfilled.type,
        payload: updatedFeeds
      } as AnyAction);
      expect(state.feeds?.orders).toHaveLength(3);
      expect(state.feeds?.total).toBe(3);
      expect(state.feeds?.totalToday).toBe(2);
    });
  });
});
