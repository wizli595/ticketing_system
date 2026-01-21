# 🚀 Quick Start Guide

## Installation & Setup (2 minutes)

### 1. Navigate to project
```bash
cd client-v2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env.local
```

Update `.env.local` if needed:
```env
NEXT_PUBLIC_API_URL=http://localhost
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Status ✅

- ✅ **Framework**: Next.js 15
- ✅ **Language**: TypeScript (strict mode)
- ✅ **Rendering**: Server-Side Rendering (SSR)
- ✅ **Styling**: Tailwind CSS 3.4
- ✅ **Build**: Successful ✓
- ✅ **Dev Server**: Running ✓

---

## Available Scripts

```bash
# Development
npm run dev        # Start dev server

# Production
npm run build      # Build for production
npm start          # Start production server

# Code Quality
npm run lint       # Run ESLint and TypeScript checks
```

---

## Key Files

| File | Purpose |
|------|---------|
| `app/` | Routes and pages (App Router) |
| `components/` | React components |
| `lib/api.ts` | Type-safe API client |
| `hooks/use-request.ts` | HTTP request hook |
| `middleware.ts` | Route protection |
| `tsconfig.json` | TypeScript config (strict mode) |

---

## Architecture at a Glance

### Pages

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Server | Browse tickets |
| `/auth/signin` | Server | Login |
| `/auth/signup` | Server | Register |
| `/tickets/new` | Client | Create ticket |
| `/orders` | Client | View orders |

### Key Components

- **Header** - Navigation with auth state
- **AuthForm** - Sign in/up forms
- **ErrorAlert** - Error display
- **ClientOnly** - Hydration wrapper

---

## Data Flow

```
User Action
    ↓
Client Component (with 'use client')
    ↓
useRequest Hook (type-safe)
    ↓
API Client (axios)
    ↓
Backend API
    ↓
Response (typed)
    ↓
State Update + UI Render
```

---

## TypeScript Benefits

✅ **Type Safety** - Catch errors at compile time
✅ **IDE Support** - Better autocomplete & hints
✅ **Self-Documenting** - Types as documentation
✅ **Refactoring** - Safe code changes
✅ **Maintainability** - Easier to understand code

---

## Performance Tips

1. **Use Server Components by default** - Reduce client JS
2. **Lazy load heavy components** - Use `dynamic()`
3. **Optimize images** - Use `next/image`
4. **Cache strategically** - Use `cache` options
5. **Split code** - Routes auto-split

---

## Common Tasks

### Add a new page

```bash
# Create file: app/new-page/page.tsx
'use client';
export default function NewPage() {
  return <h1>New Page</h1>;
}
```

### Create a new component

```bash
# Create file: components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Call API with types

```typescript
import { api, Ticket } from '@/lib/api';

const tickets = await api.tickets.list();
// tickets is typed as Ticket[]
```

---

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### TypeScript errors
```bash
npm run lint  # Check all errors
```

### Build fails
1. Check TypeScript: `npm run lint`
2. Clear cache: `rm -rf .next`
3. Reinstall: `rm -rf node_modules && npm install`

---

## Next Steps

1. ✅ Explore the codebase
2. ✅ Review TypeScript types in `lib/api.ts`
3. ✅ Check server vs client components
4. ✅ Test the API integration
5. ✅ Deploy to production

---

## Resources

- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Full setup details
- [TypeScript/SSR Guide](./TYPESCRIPT_SSR_GUIDE.md) - Best practices
- [README.md](./README.md) - Project overview
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Ready to start?** Run `npm run dev` and open [http://localhost:3000](http://localhost:3000) 🚀
