import ingredientsReducer, { fetchIngredients } from '../index';
import { AnyAction } from '@reduxjs/toolkit';

describe('Ingredients Slice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  describe('Initial State', () => {
    it('should return initial state', () => {
      expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    it('should have correct initial state structure', () => {
      expect(initialState).toEqual({
        ingredients: [],
        loading: false,
        error: null
      });
    });
  });

  describe('Request Action', () => {
    it('should set loading to true when fetchIngredients.pending is dispatched', () => {
      const action = { type: fetchIngredients.pending.type };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBe(null);
    });
  });

  describe('Success Action', () => {
    it('should set loading to false and update ingredients when fetchIngredients.fulfilled is dispatched', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.ingredients).toEqual(mockIngredients);
      expect(newState.error).toBe(null);
    });
  });

  describe('Failed Action', () => {
    it('should set loading to false and set error when fetchIngredients.rejected is dispatched', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.ingredients).toEqual([]);
    });

    it('should handle rejected action without error message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const newState = ingredientsReducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка загрузки');
      expect(newState.ingredients).toEqual([]);
    });
  });

  describe('State Transitions', () => {
    it('should handle complete request lifecycle', () => {
      let state: any = initialState;

      // Request starts
      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);

      // Request succeeds
      state = ingredientsReducer(state, {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      });
      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe(null);
    });

    it('should handle request failure after pending', () => {
      let state: any = initialState;

      // Request starts
      state = ingredientsReducer(state, {
        type: fetchIngredients.pending.type
      });
      expect(state.loading).toBe(true);

      // Request fails
      state = ingredientsReducer(state, {
        type: fetchIngredients.rejected.type,
        error: { message: 'Network error' }
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.ingredients).toEqual([]);
    });
  });
});
