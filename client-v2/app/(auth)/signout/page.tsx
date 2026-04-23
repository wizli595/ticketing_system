'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { Spinner } from '@/components/FormComponents';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await axios.post('/api/users/signout');
      } catch (error) {
        console.error('Sign out error:', error);
      } finally {
        router.push('/');
      }
    };

    performSignOut();
  }, [router]);

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="w-8 h-8 text-primary-600 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Signing you out...</p>
      </div>
    </div>
  );
}
