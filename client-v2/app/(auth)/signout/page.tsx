'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
        <p className="text-gray-600 font-medium">Signing you out...</p>
      </div>
    </div>
  );
}
