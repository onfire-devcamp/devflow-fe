// src/pages/auth/LoginPage.tsx
import React from 'react';
import AuthLayout from './AuthLayout';
import { LoginForm } from './components/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
