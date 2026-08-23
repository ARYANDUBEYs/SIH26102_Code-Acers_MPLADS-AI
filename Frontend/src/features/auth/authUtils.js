import { DEMO_USERS, ROLES } from '../../utils/constants';

export const getDemoCredentials = (role) => {
  return DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
};
