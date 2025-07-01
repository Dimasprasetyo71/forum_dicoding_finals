import { hideLoading, showLoading } from 'react-redux-loading-bar';
import api from '../../services/api';
import { receiveUsersActionCreator } from '../user/action';
import { receiveThreadsActionCreator } from '../threads/action';

export default function asyncPopulateUsersAndThreads() {
  return async (dispatch: any) => {
    dispatch(showLoading());
    try {
      const users = await api.getAllUsers();
      dispatch(receiveUsersActionCreator(users));
      const threads = await api.seeAllThreads();
      dispatch(receiveThreadsActionCreator(threads));
    } catch (error) {
      alert((error as { message: string }).message);
    }
    dispatch(hideLoading());
  };
}
