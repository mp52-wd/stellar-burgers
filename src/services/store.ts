import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredients';
import feedsReducer from './slices/feeds';
import ordersReducer from './slices/orders';
import newOrderReducer from './slices/newOrder';
import userReducer from './slices/user';
import passwordReducer from './slices/password';
import constructorReducer from './slices/constructor';

const rootReducer = combineSlices({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  orders: ordersReducer,
  newOrder: newOrderReducer,
  user: userReducer,
  password: passwordReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
