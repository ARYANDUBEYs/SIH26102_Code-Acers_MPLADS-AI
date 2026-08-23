import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { LoginForm } from '../../features/auth/LoginForm';

export const Login = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
