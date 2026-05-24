import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import { validateEmail, validatePassword } from '../utils/validation';

type LoginFieldKey = 'email' | 'password';
type LoginFieldErrors = Record<LoginFieldKey, string>;

const EMPTY_ERRORS: LoginFieldErrors = { email: '', password: '' };

export function useLoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<
    Partial<Record<LoginFieldKey, boolean>>
  >({});
  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>(EMPTY_ERRORS);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!formError) return;
    const id = window.setTimeout(() => setFormError(null), 3000);
    return () => window.clearTimeout(id);
  }, [formError]);

  const validateField = (name: LoginFieldKey, value: string): string => {
    switch (name) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
    }
  };

  const handleBlur = (name: LoginFieldKey, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = (): boolean => {
    const errors: LoginFieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setFieldErrors(errors);
    setTouched({ email: true, password: true });
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;
    setIsSubmitting(true);
    try {
      setFormError(null);
      const data = await login({ email: email.trim(), password });
      setAuth(data.token, data.user);
      navigate('/profile');
    } catch (err: unknown) {
      let message = 'Login error';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputState = (name: LoginFieldKey, value: string) => ({
    error: !!(touched[name] && fieldErrors[name]),
    success: !!(touched[name] && !fieldErrors[name] && value),
  });

  return {
    email,
    setEmail,
    password,
    setPassword,
    touched,
    fieldErrors,
    formError,
    isSubmitting,
    handleBlur,
    handleSubmit,
    inputState,
  };
}
