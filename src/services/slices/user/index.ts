import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../../utils/types';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';
import { RootState } from '../../store';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null;
  loginUserRequest: boolean;
  registerUserError: string | null;
  registerUserRequest: boolean;
  updateUserError: string | null;
  updateUserRequest: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  loginUserRequest: false,
  registerUserError: null,
  registerUserRequest: false,
  updateUserError: null,
  updateUserRequest: false
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      try {
        await dispatch(getUser()).unwrap();
      } catch (error) {
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { dispatch }) => {
    try {
      await logoutApi();
    } catch (error) {
      console.log('Ошибка выполнения выхода:', error);
    } finally {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      dispatch(userLogout());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    userLogout: (state) => {
      state.data = null;
      state.isAuthenticated = false;
    },
    clearRegisterError: (state) => {
      state.registerUserError = null;
    },
    clearLoginError: (state) => {
      state.loginUserError = null;
    },
    clearUpdateError: (state) => {
      state.updateUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUser.pending, (state) => {
        state.registerUserRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.registerUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;

        if (typeof action.payload === 'object' && action.payload !== null) {
          const err = action.payload as { message?: string };
          state.registerUserError = err.message || 'Ошибка регистрации';
        } else {
          state.registerUserError = 'Ошибка регистрации';
        }

        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;

        if (typeof action.payload === 'object' && action.payload !== null) {
          const err = action.payload as { message?: string };
          state.loginUserError = err.message || 'Ошибка входа';
        } else {
          state.loginUserError = 'Ошибка входа';
        }

        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.updateUserRequest = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;

        if (typeof action.payload === 'object' && action.payload !== null) {
          const err = action.payload as { message?: string };
          state.updateUserError = err.message || 'Ошибка обновления данных';
        } else {
          state.updateUserError = 'Ошибка обновления данных';
        }
      })

      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      });
  }
});

export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const userDataSelector = (state: RootState) => state.user.data;
export const isAuthenticatedSelector = (state: RootState) =>
  state.user.isAuthenticated;
export const loginUserRequestSelector = (state: RootState) =>
  state.user.loginUserRequest;
export const loginUserErrorSelector = (state: RootState) =>
  state.user.loginUserError;
export const registerUserRequestSelector = (state: RootState) =>
  state.user.registerUserRequest;
export const registerUserErrorSelector = (state: RootState) =>
  state.user.registerUserError;
export const updateUserRequestSelector = (state: RootState) =>
  state.user.updateUserRequest;
export const updateUserErrorSelector = (state: RootState) =>
  state.user.updateUserError;

export const {
  authChecked,
  userLogout,
  clearRegisterError,
  clearLoginError,
  clearUpdateError
} = userSlice.actions;
export default userSlice.reducer;
