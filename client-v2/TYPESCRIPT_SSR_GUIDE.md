# Next.js 15 + TypeScript Best Practices Guide

## 📋 Table of Contents

1. [Server Components vs Client Components](#server-vs-client)
2. [TypeScript Setup](#typescript-setup)
3. [Data Fetching Patterns](#data-fetching)
4. [Type Safety](#type-safety)
5. [Performance](#performance)
6. [Security](#security)
7. [Common Patterns](#patterns)

---

## Server vs Client Components {#server-vs-client}

### When to Use Server Components

**Use Server Components when:**
- Fetching data from databases or APIs
- Keeping sensitive information server-side
- Using large dependencies on the server
- Reducing client-side JavaScript

```typescript
// ✅ Good: Server Component
export default async function ProductList() {
  const products = await fetchProducts();
  
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### When to Use Client Components

**Use Client Components when:**
- You need interactivity (useState, onClick, etc.)
- Using browser APIs (localStorage, window, etc.)
- Using React hooks
- Event listeners

```typescript
// ✅ Good: Client Component
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Mixing Both

```typescript
// ✅ Good: Server component with client child
export default async function Page() {
  const data = await fetchData();
  
  return (
    <div>
      <InteractiveChart data={data} />
    </div>
  );
}

// This is a client component that receives server data
'use client';

export function InteractiveChart({ data }) {
  const [filter, setFilter] = useState('');
  // ...
}
```

---

## TypeScript Setup {#typescript-setup}

### Strict Mode Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    // Strict type checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    
    // Unused code detection
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    
    // Other
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Definition Examples

```typescript
// ✅ Good: Well-defined types
interface User {
  id: string;
  email: string;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

// ✅ Good: Union types for status
type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
}

// ❌ Bad: Too loose
interface User {
  [key: string]: any;
}
```

---

## Data Fetching Patterns {#data-fetching}

### Server Component Data Fetching

```typescript
// ✅ Good: Fetch in Server Component
export default async function HomePage() {
  const tickets = await fetchTickets();
  
  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

async function fetchTickets(): Promise<Ticket[]> {
  const response = await fetch('http://api.example.com/tickets', {
    cache: 'no-store', // or 'force-cache' for static
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch tickets');
  }
  
  return response.json();
}
```

### Client Component Data Fetching

```typescript
// ✅ Good: Fetch in Client Component
'use client';

import { useEffect, useState } from 'react';

interface Ticket {
  id: string;
  title: string;
  price: number;
}

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

### Custom Hook Pattern

```typescript
// ✅ Good: Type-safe custom hook
'use client';

import { useState, useCallback } from 'react';

interface RequestOptions<T> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  onSuccess?: (data: T) => void;
}

interface UseRequestReturn<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: () => Promise<T>;
}

export function useRequest<T = unknown>(
  options: RequestOptions<T>
): UseRequestReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(options.url, {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : undefined,
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Request failed');
      
      const result = await response.json();
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);
  
  return { data, error, isLoading, execute };
}
```

---

## Type Safety {#type-safety}

### API Layer

```typescript
// lib/api.ts
export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code: string;
}

export interface ApiResponse<T> {
  data: T;
  error: ApiError | null;
}

async function apiCall<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
}

export const api = {
  tickets: {
    list: () => apiCall<Ticket[]>('/api/tickets'),
    get: (id: string) => apiCall<Ticket>(`/api/tickets/${id}`),
    create: (data: Omit<Ticket, 'id' | 'version' | 'createdAt'>) =>
      apiCall<Ticket>('/api/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
```

### Component Props

```typescript
// ✅ Good: Explicit prop types
interface TicketCardProps {
  ticket: Ticket;
  onSelect?: (id: string) => void;
  loading?: boolean;
}

export function TicketCard({
  ticket,
  onSelect,
  loading = false,
}: TicketCardProps) {
  return (
    <div>
      <h3>{ticket.title}</h3>
      <p>${(ticket.price / 100).toFixed(2)}</p>
      <button onClick={() => onSelect?.(ticket.id)} disabled={loading}>
        Select
      </button>
    </div>
  );
}
```

### Form Handling

```typescript
// ✅ Good: Type-safe form handling
'use client';

import { FormEvent, useState } from 'react';

interface FormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      // Handle response
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## Performance {#performance}

### Image Optimization

```typescript
// ✅ Good: Use Next.js Image component
import Image from 'next/image';

export function TicketImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### Code Splitting

```typescript
// ✅ Good: Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
});

export function Page() {
  return <HeavyComponent />;
}
```

### Caching Strategies

```typescript
// ✅ Good: Use fetch cache options
async function getTickets() {
  // Cache for 60 seconds (revalidate)
  const response = await fetch('/api/tickets', {
    next: { revalidate: 60 },
  });
  return response.json();
}

// Or use cache: no-store for real-time data
async function getCurrentUser() {
  const response = await fetch('/api/user', {
    cache: 'no-store',
  });
  return response.json();
}
```

---

## Security {#security}

### Environment Variables

```typescript
// ✅ Good: Separate public and private variables
// .env.local
NEXT_PUBLIC_API_URL=http://api.example.com  // Public
DATABASE_URL=postgresql://...               // Private (server-only)

// ✅ Good: Type-safe env access
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      DATABASE_URL: string;
    }
  }
}
```

### Input Validation

```typescript
// ✅ Good: Validate input
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password: string): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
```

### CSRF Protection

```typescript
// ✅ Good: Use SameSite cookies and CSRF tokens
'use client';

export async function submitForm(formData: FormData) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    credentials: 'include', // Include cookies
    body: formData,
  });
  
  return response.json();
}
```

---

## Common Patterns {#patterns}

### Loading States

```typescript
// ✅ Good: Suspense + Fallback
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<TicketListSkeleton />}>
      <TicketList />
    </Suspense>
  );
}

async function TicketList() {
  const tickets = await fetchTickets();
  return <div>{/* render tickets */}</div>;
}

function TicketListSkeleton() {
  return <div className="animate-pulse">Loading...</div>;
}
```

### Error Handling

```typescript
// ✅ Good: Error boundary
'use client';

import { useEffect } from 'react';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  
  return (
    <div>
      <h1>Something went wrong!</h1>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  
  // Protect routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Last Updated**: January 21, 2026
