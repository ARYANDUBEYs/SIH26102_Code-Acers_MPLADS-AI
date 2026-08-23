import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { RegisterForm } from '../../features/auth/RegisterForm';

export const Register = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
