import { AuthForm } from '@/components/AuthForm';

export const metadata = {
  title: 'Sign Up - GitTix',
  description: 'Create a new GitTix account',
};

export default function SignUpPage() {
  return <AuthForm title="Create Account" uri="/api/users/signup" formBase="Up" />;
}
