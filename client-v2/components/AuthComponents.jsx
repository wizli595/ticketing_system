'use client';

import { useRequest } from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ErrorAlert({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Please check the following:
          </h3>
          <ul className="mt-2 list-disc list-inside text-sm text-red-700 space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function FormContainer({ children, title }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-elevated p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AuthForm({ title, uri, formBase }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors, isLoading } = useRequest({
    url: uri,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <FormContainer title={title}>
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
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : `Sign ${formBase}`}
        </button>
      </form>

      {formBase === 'Up' && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </a>
        </p>
      )}

      {formBase === 'In' && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="text-primary-600 hover:text-primary-700 font-medium">
            Create one
          </a>
        </p>
      )}
    </FormContainer>
  );
}
