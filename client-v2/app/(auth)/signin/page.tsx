import { AuthForm } from '@/components/AuthForm';

export const metadata = {
  title: 'Sign In - GitTix',
  description: 'Sign in to your GitTix account',
};

export default function SignInPage() {
  return <AuthForm title="Welcome Back" uri="/api/users/signin" formBase="In" />;
}
