import { forgotPasswordApi, resetPasswordApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface IPasswordState {
  loading: boolean;
  error: string | null;
  isResetEmailSent: boolean;
  isPasswordReset: boolean;
}

const initialState: IPasswordState = {
  loading: false,
  error: null,
  isResetEmailSent: false,
  isPasswordReset: false
};

export const forgotPassword = createAsyncThunk(
  'password/forgotPassword',
  async (email: string) => await forgotPasswordApi({ email })
);

export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearPasswordState: (state) => {
      state.error = null;
      state.isResetEmailSent = false;
      state.isPasswordReset = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.isResetEmailSent = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || 'Ошибка отправки email для сброса пароля';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isPasswordReset = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ошибка сброса пароля';
      });
  }
});

export const { clearPasswordState } = passwordSlice.actions;

// Селекторы
export const forgotPasswordErrorSelector = (state: RootState) =>
  state.password.error;
export const resetPasswordErrorSelector = (state: RootState) =>
  state.password.error;

export default passwordSlice.reducer;
