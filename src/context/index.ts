/* eslint-disable import/no-cycle */
import { ApiContext } from './ApiContext';
import { AuthContext } from './AuthContext';
import { ModalContext } from './ModalContext';
import { UserContext } from './UserContext';

export default {
  Api: ApiContext,
  Auth: AuthContext,
  Modal: ModalContext,
  User: UserContext,
};
