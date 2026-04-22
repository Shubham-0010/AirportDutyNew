import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {loginStart, loginSuccess, loginFailure, logout, clearError} from '../store/slices/authSlice';
import {loginApi, logoutApi} from '../api/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  const login = async credentials => {
    dispatch(loginStart());
    try {
      const res = await loginApi(credentials);
      dispatch(loginSuccess(res.data));
      return true;
    } catch (err) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(msg));
      Toast.show({type: 'error', text1: 'Login Failed', text2: msg});
      return false;
    }
  };

  const signOut = async () => {
    try {
      await logoutApi();
    } catch {}
    dispatch(logout());
  };

  return {...authState, login, signOut, clearError: () => dispatch(clearError())};
};
