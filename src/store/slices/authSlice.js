import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    token: null,
    role: null,
    user: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user;
    },
    loginFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
      state.user = null;
      state.error = null;
    },
    forceLogout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
      state.user = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {loginStart, loginSuccess, loginFailure, logout, forceLogout, clearError} = authSlice.actions;
export default authSlice.reducer;
