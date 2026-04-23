'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequest } from '@/hooks/use-request';
import { FormContainer, ErrorAlert, Spinner } from './FormComponents';

interface AuthFormProps {
  title: string;
  uri: string;
  formBase: 'Up' | 'In';
}

export function AuthForm({ uri, formBase }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors, isLoading } = useRequest({
    url: uri,
    method: 'post',
    body: { email, password },
    onSuccess: () => router.push('/'),
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const isSignUp = formBase === 'Up';

  return (
    <FormContainer
      title={isSignUp ? 'Create Account' : 'Welcome Back'}
      subtitle={isSignUp ? 'Start buying and selling tickets' : 'Sign in to your account'}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <ErrorAlert errors={errors} />

        <div>
          <label htmlFor="email" className="label">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your password"
            required
            disabled={isLoading}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
        </div>

        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? <Spinner /> : null}
          {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          href={isSignUp ? '/signin' : '/signup'}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          {isSignUp ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </FormContainer>
  );
}
