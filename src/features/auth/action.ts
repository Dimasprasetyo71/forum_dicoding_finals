import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import type { User } from '../../types';

const ActionType = {
  SET_AUTH_USER: 'SET_AUTH_USER',
  UNSET_AUTH_USER: 'UNSET_AUTH_USER',
};

function setAuthUserActionCreator(authUser: User | null) {
  return {
    type: ActionType.SET_AUTH_USER,
    payload: {
      authUser,
    },
  };
}

function unsetAuthUserActionCreator() {
  return {
    type: ActionType.UNSET_AUTH_USER,
  };
}

function asyncSetAuthUser({ email, password }: { email: string; password: string }) {
  return async (dispatch: any) => {
    dispatch(showLoading());
    try {
      // 1) Login
      const token = await api.login({ email, password, name: '' });

      // 2) Simpan token
      api.putAccessToken(token);

      // 3) Ambil profil user
      const authUser = await api.getOwnProfile();

      // 4) Set user di state
      dispatch(setAuthUserActionCreator(authUser));
    } catch (error: any) {
      console.error('Error logging in:', error);

      // Optional: lempar supaya bisa catch di komponen
      throw error;
    } finally {
      dispatch(hideLoading());
    }
  };
}


function asyncUnsetAuthUser() {
  return async (dispatch : any) => {
    dispatch(unsetAuthUserActionCreator());
    api.putAccessToken('');
  };
}

export {
  ActionType,
  setAuthUserActionCreator,
  unsetAuthUserActionCreator,
  asyncSetAuthUser,
  asyncUnsetAuthUser,
};