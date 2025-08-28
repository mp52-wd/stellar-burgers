import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../index';

describe('Constructor Slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun = {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun-image.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  };

  const mockMainIngredient = {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'main-image.png',
    image_mobile: 'main-mobile.png',
    image_large: 'main-large.png'
  };

  describe('addIngredient', () => {
    it('should add bun to constructor', () => {
      const action = addIngredient(mockBun);
      const newState = constructorReducer(initialState, action);

      expect(newState.bun).toMatchObject(mockBun);
      expect(newState.bun).toHaveProperty('id');
    });

    it('should add main ingredient to constructor', () => {
      const action = addIngredient(mockMainIngredient);
      const newState = constructorReducer(initialState, action);

      expect(newState.ingredients).toHaveLength(1);
      expect(newState.ingredients[0]).toMatchObject(mockMainIngredient);
      expect(newState.ingredients[0]).toHaveProperty('id');
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient from constructor', () => {
      // Сначала добавляем ингредиент
      let state = constructorReducer(
        initialState,
        addIngredient(mockMainIngredient)
      );
      expect(state.ingredients).toHaveLength(1);

      // Затем удаляем его
      const ingredientToRemove = state.ingredients[0];
      const action = removeIngredient(ingredientToRemove.id);
      state = constructorReducer(state, action);

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient', () => {
    it('should move ingredient to new position', () => {
      // Добавляем несколько ингредиентов
      let state = constructorReducer(
        initialState,
        addIngredient(mockMainIngredient)
      );
      state = constructorReducer(
        state,
        addIngredient({
          ...mockMainIngredient,
          _id: 'main-2',
          name: 'Второй ингредиент'
        })
      );

      expect(state.ingredients).toHaveLength(2);
      const firstIngredient = state.ingredients[0];
      const secondIngredient = state.ingredients[1];

      // Меняем местами
      const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
      state = constructorReducer(state, action);

      expect(state.ingredients[0]).toEqual(secondIngredient);
      expect(state.ingredients[1]).toEqual(firstIngredient);
    });
  });
});
