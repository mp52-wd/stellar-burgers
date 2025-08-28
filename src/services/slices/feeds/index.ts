import { getFeedsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '../../../utils/types';

interface IFeedsState {
  feeds: TOrdersData | null;
  loading: boolean;
  error: string | null;
}

const initialState: IFeedsState = {
  feeds: null,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feeds/fetchFeeds', getFeedsApi);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка загрузки';
      });
  }
});

export default feedsSlice.reducer;

// Селекторы
export const feedsSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.feeds;
export const feedsLoadingSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.loading;
export const feedsErrorSelector = (state: { feeds: IFeedsState }) =>
  state.feeds.error;
