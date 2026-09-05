import React from 'react';
import { Modal } from './Modal';
import { LoginForm } from '../../features/auth/LoginForm';
import { ROLES } from '../../utils/constants';

export const AuthModal = ({ isOpen, onClose, initialRole = ROLES.MOSPI_ADMIN }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={true}>
      <LoginForm onSuccess={onClose} initialRole={initialRole} />
    </Modal>
  );
};
