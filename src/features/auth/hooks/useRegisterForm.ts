import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '../utils/validation';

export type RegisterFieldKey =
  | 'username'
  | 'email'
  | 'password'
  | 'confirmPassword';
type FieldErrors = Record<RegisterFieldKey, string> & { terms: string };

const EMPTY_ERRORS: FieldErrors = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
};

function getPasswordStrength(password: string): number {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(EMPTY_ERRORS);
  const [touched, setTouched] = useState<
    Partial<Record<RegisterFieldKey, boolean>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (!formError) return;
    const id = window.setTimeout(() => setFormError(null), 5000);
    return () => window.clearTimeout(id);
  }, [formError]);

  useEffect(() => {
    if (!confirmPassword) return;
    setFieldErrors((prev) => ({
      ...prev,
      confirmPassword:
        password !== confirmPassword ? 'Passwords do not match.' : '',
    }));
  }, [password, confirmPassword]);

  const validateField = (name: RegisterFieldKey, value: string): string => {
    switch (name) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        return validateConfirmPassword(password, value);
    }
  };

  const handleBlur = (name: RegisterFieldKey, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = (): boolean => {
    const errors: FieldErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      terms: !agreed
        ? 'Please agree to the Terms of Service and Privacy Policy.'
        : '',
    };
    setFieldErrors(errors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try {
      setFormError(null);
      const data = await register({
        email: email.trim(),
        password,
        username: username.trim(),
      });
      setAuth(data.token, data.user);
      navigate('/profile');
    } catch (err: unknown) {
      let message = 'Something went wrong. Please try again.';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputState = (name: RegisterFieldKey, value: string) => ({
    error: !!(touched[name] && fieldErrors[name]),
    success: !!(touched[name] && !fieldErrors[name] && value),
  });

  const iconColor = (name: RegisterFieldKey) =>
    touched[name] && fieldErrors[name] ? 'text-red-400' : 'text-fg-muted';

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agreed,
    setAgreed,
    isSubmitting,
    fieldErrors,
    setFieldErrors,
    touched,
    formError,
    passwordStrength,
    handleBlur,
    handleSubmit,
    inputState,
    iconColor,
  };
}
