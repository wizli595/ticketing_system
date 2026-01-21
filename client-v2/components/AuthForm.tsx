'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequest } from '@/hooks/use-request';
import { FormContainer, ErrorAlert } from './FormComponents';

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
    method: 'post' as const,
    body: {
      email,
      password,
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await doRequest();
  };

  const isSignUp = formBase === 'Up';
  const submitText = isSignUp ? 'Create Account' : 'Welcome Back';
  const buttonText = isSignUp ? 'Sign Up' : 'Sign In';
  const alternativeText = isSignUp ? 'Already have an account?' : "Don't have an account?";
  const alternativeLink = isSignUp ? '/signin' : '/signup';
  const alternativeLinkText = isSignUp ? 'Sign in' : 'Create one';

  return (
    <FormContainer title={submitText}>
      <form onSubmit={onSubmit} className="space-y-6">
        <ErrorAlert errors={errors} />

        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Loading...
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        {alternativeText}{' '}
        <a
          href={alternativeLink}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          {alternativeLinkText}
        </a>
      </p>
    </FormContainer>
  );
}
