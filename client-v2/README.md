# GitTix Client v2

A modern Next.js 15 client with enhanced Tailwind CSS styling for the GitTix microservices ticketing platform.

## Features

✨ **Modern Stack**
- Next.js 15 with App Router
- React 18
- Tailwind CSS 3.4 for enhanced styling
- TypeScript support

🎨 **Enhanced Styling**
- Custom Tailwind components (buttons, inputs, cards)
- Smooth animations and transitions
- Responsive design with mobile-first approach
- Gradient accents and shadow effects
- Dark/light mode ready

🚀 **Performance**
- Server-side rendering
- Optimized bundle size
- Image optimization
- CSS optimization

## Project Structure

```
client-v2/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── tickets/           # Ticket management pages
│   ├── orders/            # Order management
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── styles/                # Global styles and Tailwind CSS
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd client-v2
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## Key Pages

- **Home** (`/`) - Browse available tickets
- **Sign Up** (`/auth/signup`) - Create account
- **Sign In** (`/auth/signin`) - Login
- **Sign Out** (`/auth/signout`) - Logout
- **Create Ticket** (`/tickets/new`) - List new tickets
- **Ticket Detail** (`/tickets/[ticketId]`) - View and purchase tickets
- **My Orders** (`/orders`) - View purchased tickets

## API Integration

The client communicates with the backend services:
- `/api/users/*` - Authentication
- `/api/tickets` - Ticket management
- `/api/orders` - Order management

## Styling

### Tailwind Classes

Custom Tailwind components are defined in `styles/globals.css`:

- `.btn` - Base button styles
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (purple)
- `.btn-outline` - Outline button
- `.input-field` - Form input styling
- `.card` - Card component
- `.label` - Form label

### Color Palette

- Primary: Blue (600, 700)
- Secondary: Purple (600, 700)
- Neutral: Gray scale

## Deployment

### Docker

```bash
docker build -t gittix-client-v2 .
docker run -p 3000:3000 gittix-client-v2
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost
```

## Features Comparison

| Feature | v1 | v2 |
|---------|----|----|
| Framework | Next 13 | Next 15 |
| Styling | Bootstrap | Tailwind CSS |
| Components | Class-based | Functional |
| Routing | Pages Router | App Router |
| Type Safety | Partial | Full TypeScript |
| Animations | Basic | Enhanced |
| DX | Good | Excellent |

## License

ISC
