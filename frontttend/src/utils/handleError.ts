import type { Dispatch } from 'react';
import type { Action } from '../types';
import { ApiError } from '../api';

// 401/403 on a protected call = missing or expired token -> log out. Anything else -> show the message.
export const handleError = (err: error, dispatch: Dispatch<Action>) => {
  if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
    dispatch({ type: 'LOGOUT' });
    dispatch({ type: 'SET_ERROR', payload: 'Your session expired. Please log in again.' });
    return;
  }
  dispatch({
    type: 'SET_ERROR',
    payload: err instanceof Error ? err.message : 'Something went wrong',
  });
};
