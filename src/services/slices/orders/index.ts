import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../../../utils/types';

interface IOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: IOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка загрузки';
      });
  }
});

export default ordersSlice.reducer;

// Селекторы
export const ordersSelector = (state: { orders: IOrdersState }) =>
  state.orders.orders;
export const ordersLoadingSelector = (state: { orders: IOrdersState }) =>
  state.orders.loading;
export const ordersErrorSelector = (state: { orders: IOrdersState }) =>
  state.orders.error;
