// src/features/auth/components/LoginPage.tsx
import React from 'react';
import AuthLayout from './AuthLayout';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
