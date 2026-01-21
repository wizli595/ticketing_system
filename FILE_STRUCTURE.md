# Project File Structure - Detailed Guide

## Overview
This document provides a comprehensive breakdown of every directory and key files in the ticketing system project, explaining their purpose and relationships.

---

## 📁 Root Directory Structure

```
ticketing_system/
├── auth/                      # Authentication & User Management Microservice
├── client/                    # Next.js Frontend Application
├── tickets/                   # Ticket Management Microservice
├── orders/                    # Order Processing Microservice
├── payments/                  # Payment Processing Microservice (Stripe)
├── expiration/                # Order Expiration Handler Microservice
├── nats-test/                 # Event Testing & Type Definitions
├── common/                    # Shared Libraries (npm package)
├── infra/                     # Infrastructure & Kubernetes Configs
├── skaffold.yaml             # Skaffold development configuration
├── docker-compose.yml        # Docker Compose for local development
├── README.md                 # Project overview (original)
├── README_COMPREHENSIVE.md   # Detailed documentation (new)
├── LICENSE                   # ISC License
└── instructions.txt          # Developer notes & kubectl commands
```

---

## 🔐 Auth Service (`/auth`)

**Purpose**: User authentication, registration, login/logout, session management

### Directory Structure
```
auth/
├── src/
│   ├── app.ts               # Express application setup
│   │                        # - Middleware configuration (morgan, cookie-session)
│   │                        # - Route mounting
│   │                        # - Error handling
│   │                        # - CORS & trust proxy settings
│   │
│   ├── index.ts             # Server entry point
│   │                        # - Port configuration (3000)
│   │                        # - MongoDB connection
│   │                        # - Server startup
│   │
│   ├── models/
│   │   └── user-model.ts    # MongoDB User schema & model
│   │                        # - Email (unique, required)
│   │                        # - Password (hashed, required)
│   │                        # - Pre-save hook for password hashing
│   │                        # - Static build() method for type safety
│   │
│   ├── routes/
│   │   ├── signup.ts        # POST /api/users/signup
│   │   │                    # - Email validation
│   │   │                    # - Password strength checks
│   │   │                    # - Duplicate email prevention
│   │   │                    # - Returns JWT in cookie
│   │   │
│   │   ├── signin.ts        # POST /api/users/signin
│   │   │                    # - Email/password validation
│   │   │                    # - Password comparison
│   │   │                    # - JWT token generation
│   │   │
│   │   ├── signout.ts       # POST /api/users/signout
│   │   │                    # - Clears authentication cookie
│   │   │                    # - Redirects to homepage
│   │   │
│   │   └── current-user.ts  # GET /api/users/currentUser
│   │                        # - Returns authenticated user info
│   │                        # - No password field (stripped by schema)
│   │
│   ├── services/
│   │   └── password.ts      # Password utility functions
│   │                        # - toHash(): bcrypt hashing
│   │                        # - compare(): password verification
│   │
│   ├── test/
│   │   └── setup.ts         # Jest test configuration
│   │                        # - MongoDB Memory Server setup
│   │                        # - Global test hooks
│   │
│   └── access.log           # HTTP request log file (auto-generated)
│                            # Morgan logging output
│
├── Dockerfile               # Docker image configuration
│                            # - Node base image
│                            # - TypeScript compilation
│                            # - npm install & start
│
├── package.json             # Node.js dependencies & scripts
│                            # Dependencies:
│                            # - express, mongoose, jsonwebtoken
│                            # - cookie-session, express-validator
│                            # - @wizlitickets/common (shared lib)
│                            # Scripts:
│                            # - start: ts-node-dev src/index.ts
│                            # - test: jest tests
│
├── tsconfig.json            # TypeScript configuration
│                            # - Compilation target (ES2020)
│                            # - Module system (commonjs)
│                            # - Strict type checking enabled
│
└── .dockerignore            # Files to exclude from Docker image
                             # - node_modules
                             # - .git
                             # - npm logs
```

---

## 🎫 Tickets Service (`/tickets`)

**Purpose**: Ticket CRUD operations, listing, availability management

### Directory Structure
```
tickets/
├── src/
│   ├── app.ts               # Express app configuration
│   │                        # - Middleware setup (express-json, cookie-session)
│   │                        # - Route mounting
│   │                        # - Error handling
│   │
│   ├── index.ts             # Server entry point & NATS initialization
│   │                        # - MongoDB connection
│   │                        # - NATS Streaming connection
│   │                        # - OrderExpired event listener setup
│   │                        # - Graceful shutdown handling
│   │
│   ├── models/
│   │   └── ticket.ts        # MongoDB Ticket schema
│   │                        # Fields:
│   │                        # - title: String (event name)
│   │                        # - price: Number (USD)
│   │                        # - userId: String (seller ID)
│   │                        # - orderId: String (buyer's order, if locked)
│   │                        # - version: Number (optimistic concurrency)
│   │                        # Methods:
│   │                        # - static build(): Type-safe document creation
│   │                        # Plugin: updateIfCurrentPlugin (version safety)
│   │
│   ├── routes/
│   │   ├── create.ts        # POST /api/tickets
│   │   │                    # - Create new ticket for sale
│   │   │                    # - Auth required
│   │   │                    # - Title & price validation
│   │   │                    # - Publishes TicketCreated event
│   │   │
│   │   ├── index.ts         # GET /api/tickets
│   │   │                    # - List all available tickets
│   │   │                    # - No auth required
│   │   │                    # - Returns all tickets (both available & locked)
│   │   │
│   │   ├── show.ts          # GET /api/tickets/:id
│   │   │                    # - Get single ticket details
│   │   │                    # - Returns: title, price, userId, orderId, version
│   │   │
│   │   ├── update.ts        # PUT /api/tickets/:id
│   │   │                    # - Update ticket (seller only)
│   │   │                    # - Can modify: title, price
│   │   │                    # - Cannot modify: userId, orderId
│   │   │                    # - Version check prevents race conditions
│   │   │                    # - Publishes TicketUpdated event
│   │   │
│   │   └── ___test___/      # Test files for routes
│   │
│   ├── events/
│   │   ├── listeners/       # Event listeners
│   │   │   └── order-created-listener.ts (if cached tickets needed)
│   │   │   └── order-cancelled-listener.ts
│   │   │   └── order-expired-listener.ts
│   │   │                    # When order expires: remove orderId from ticket
│   │   │
│   │   └── publishers/      # Event publishers
│   │       └── ticket-created-publisher.ts
│   │                        # Publishes: { id, title, price, userId, version }
│   │
│   ├── nats-wrapper.ts      # NATS Streaming connection
│   │                        # - Manages client connection lifecycle
│   │                        # - Connection error handling
│   │                        # - Graceful disconnect
│   │
│   ├── test/
│   │   ├── setup.ts         # Jest configuration
│   │   │                    # - MongoDB Memory Server
│   │   │                    # - Test database setup
│   │   │
│   │   └── ticket.test.ts   # Ticket model tests
│   │
│   └── access.log           # HTTP request logs
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── .dockerignore
```

---

## 📦 Orders Service (`/orders`)

**Purpose**: Order creation, management, expiration handling, payment coordination

### Directory Structure
```
orders/
├── src/
│   ├── app.ts               # Express app configuration
│   │
│   ├── index.ts             # Server entry point
│   │                        # - MongoDB connection
│   │                        # - NATS Streaming connection
│   │                        # - Event listener setup:
│   │                        #   • PaymentCreatedListener (to confirm orders)
│   │                        #   • TicketCreatedListener (cache tickets)
│   │
│   ├── models/
│   │   ├── order-model.ts   # MongoDB Order schema
│   │   │                    # Fields:
│   │   │                    # - userId: String (buyer)
│   │   │                    # - status: Enum
│   │   │                    #   - Pending
│   │   │                    #   - AwaitingPayment (15-min timer active)
│   │   │                    #   - Confirmed (payment received)
│   │   │                    #   - Cancelled (payment timeout/failed)
│   │   │                    # - expiresAt: Date (15 min from creation)
│   │   │                    # - ticket: ObjectId (reference)
│   │   │                    # - version: Number (optimistic concurrency)
│   │   │                    # Methods:
│   │   │                    # - static build(): Type-safe creation
│   │   │
│   │   └── ticket-model.ts  # Ticket reference model
│   │                        # - Mirrors tickets service schema
│   │                        # - Used for order.populate('ticket')
│   │                        # - Fields: title, price, userId, orderId
│   │
│   ├── routes/
│   │   ├── new.ts           # POST /api/orders
│   │   │                    # - Create new order
│   │   │                    # - Auth required (buyer)
│   │   │                    # - Ticket ID required in body
│   │   │                    # - Checks: ticket exists, not already ordered
│   │   │                    # - Creates order with 15-min expiration
│   │   │                    # - Sets ticket.orderId
│   │   │                    # - Publishes OrderCreated event
│   │   │
│   │   ├── index.ts         # GET /api/orders
│   │   │                    # - List current user's orders
│   │   │                    # - Auth required
│   │   │                    # - Returns: all user orders with ticket details
│   │   │
│   │   └── show.ts          # GET /api/orders/:id
│   │                        # - Get single order details
│   │                        # - Auth required
│   │                        # - Returns: order with populated ticket
│   │
│   ├── events/
│   │   ├── listeners/
│   │   │   ├── payment-created-listener.ts
│   │   │   │                    # Listens for: PaymentCreated event
│   │   │   │                    # Actions:
│   │   │   │                    # - Update order status → Confirmed
│   │   │   │                    # - Update version (optimistic concurrency)
│   │   │   │                    # - Cancel expiration job (if exists)
│   │   │   │                    # - Publishes OrderUpdated event
│   │   │   │
│   │   │   └── ticket-created-listener.ts
│   │   │                       # Caches ticket data locally for quick access
│   │   │
│   │   └── publishers/
│   │       ├── order-created-publisher.ts
│   │       │                    # Publishes: OrderCreated event
│   │       │                    # Sent to: Expiration, Payments services
│   │       │                    # Payload: { id, userId, status, ticketId, expiresAt, version }
│   │       │
│   │       └── order-updated-publisher.ts
│   │                            # Publishes: OrderUpdated event
│   │
│   ├── nats-wrapper.ts      # NATS connection management
│   │
│   ├── test/
│   │   └── ... test files
│   │
│   └── access.log
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── .dockerignore
```

---

## 💳 Payments Service (`/payments`)

**Purpose**: Stripe payment processing, charge creation, payment records

### Directory Structure
```
payments/
├── src/
│   ├── app.ts               # Express app configuration
│   │
│   ├── index.ts             # Server entry point
│   │                        # - MongoDB connection
│   │                        # - NATS Streaming connection
│   │                        # - OrderCreatedListener setup
│   │
│   ├── stripe.ts            # Stripe API initialization & wrapper
│   │                        # - Initialize Stripe SDK with API key
│   │                        # - Export stripe instance for use in routes
│   │
│   ├── routes/
│   │   └── new.ts           # POST /api/payments
│   │                        # - Create payment charge
│   │                        # - Auth required
│   │                        # - Body: { orderId, token, amount }
│   │                        # - Stripe charge creation
│   │                        # - Idempotency key prevents double-charging
│   │                        # - Saves Charge document to MongoDB
│   │                        # - Publishes PaymentCreated event
│   │                        # - Error handling for failed payments
│   │
│   ├── models/
│   │   └── charge.ts        # MongoDB Charge schema
│   │                        # Fields:
│   │                        # - orderId: String (reference)
│   │                        # - stripeId: String (Stripe charge ID)
│   │                        # - amount: Number (cents, e.g., 50000 = $500)
│   │                        # - status: String ('succeeded', 'failed', etc)
│   │
│   ├── events/
│   │   ├── listeners/
│   │   │   └── order-created-listener.ts
│   │   │                    # Listens for: OrderCreated event
│   │   │                    # Purpose: Acknowledge that payment is expected
│   │   │
│   │   └── publishers/
│   │       └── payment-created-publisher.ts
│   │                        # Publishes: PaymentCreated event
│   │                        # Sent to: Orders service
│   │                        # Payload: { id, orderId, stripeId, amount, status }
│   │
│   ├── nats-wrapper.ts      # NATS connection
│   │
│   ├── test/
│   │   └── ... test files
│   │
│   └── access.log
│
├── Dockerfile
├── package.json             # Stripe SDK dependency
├── tsconfig.json
└── .dockerignore
```

---

## ⏰ Expiration Service (`/expiration`)

**Purpose**: Handle order expiration, auto-release locked tickets after 15 minutes

### Directory Structure
```
expiration/
├── src/
│   ├── index.ts             # Server entry point (no HTTP server)
│   │                        # - MongoDB: NOT USED (stateless service)
│   │                        # - NATS Streaming: connection & listener
│   │                        # - Redis: connection for Bull job queue
│   │                        # - OrderCreatedListener setup
│   │                        # - Graceful shutdown handling
│   │
│   ├── nats-wrapper.ts      # NATS Streaming connection
│   │
│   ├── events/
│   │   ├── listeners/
│   │   │   └── order-created-listener.ts
│   │   │                    # Listens for: OrderCreated event
│   │   │                    # Actions:
│   │   │                    # 1. Extract expiresAt from order
│   │   │                    # 2. Calculate delay = expiresAt - now
│   │   │                    # 3. Create delayed job in Bull queue
│   │   │                    # 4. Job runs after delay
│   │   │                    # 5. On execution:
│   │   │                    #    - Check order status (still AwaitingPayment?)
│   │   │                    #    - If yes: Publish ExpirationComplete
│   │   │                    #    - If no: Skip (already confirmed)
│   │   │
│   │   └── publishers/
│   │       └── expiration-complete-publisher.ts
│   │                        # Publishes: ExpirationComplete event
│   │                        # (alternative: OrderExpired)
│   │                        # Sent to: Orders service
│   │                        # Triggers: Order cancellation & ticket re-listing
│   │
│   └── queues/
│       └── expiration-queue.ts
│                            # Bull job queue configuration
│                            # - Redis connection
│                            # - Queue name: "order:expiration"
│                            # - Job processing handler
│                            # - Error & completion callbacks
│                            # - Persistence in Redis (survives restarts)
│
├── Dockerfile
├── package.json             # Dependencies: bull, node-nats-streaming
├── tsconfig.json
└── .dockerignore
```

### How Expiration Works (Detailed Flow)

```
OrderCreated Event (NATS)
        │
        ▼
[Expiration Service Listener]
  ├─ Extract: orderId, expiresAt
  ├─ Calculate: delayMs = expiresAt.getTime() - Date.now()
  │
  ▼
[Bull Queue (Redis)]
  ├─ Create Job: {
  │    jobId: orderId,
  │    data: { orderId },
  │    delay: delayMs,
  │    attempts: 3,
  │    backoff: exponential
  │  }
  ├─ Job persists in Redis
  │
  ├─ [If Server Restarts]
  │  └─ Bull recovers job from Redis
  │     and reschedules it
  │
  └─ [After delay passes]
      │
      ▼
   [Job Processor]
     ├─ Fetch order from Orders Service
     │  (via NATS request-reply or HTTP)
     ├─ Check: status === 'AwaitingPayment'?
     │
     ├─ YES: Publish ExpirationComplete
     │       Orders Service cancels order
     │       Tickets Service re-lists ticket
     │
     └─ NO: Skip (already confirmed)
            Order status is Confirmed
```

---

## 🖥️ Client Application (`/client`)

**Purpose**: Next.js frontend for users to buy/sell tickets

### Directory Structure
```
client/
├── pages/
│   ├── _app.js              # Next.js root component
│   │                        # - Wraps all pages
│   │                        # - Bootstrap CSS import
│   │                        # - Header component (persistent nav)
│   │                        # - API client initialization
│   │
│   ├── _document.js         # Next.js document (optional)
│   │                        # - HTML structure
│   │                        # - Meta tags
│   │
│   ├── index.js             # Homepage - Tickets List
│   │                        # - Displays all available tickets
│   │                        # - GET /api/tickets
│   │                        # - Shows: title, price, seller info
│   │                        # - SSR (Server-Side Rendering)
│   │
│   ├── auth/
│   │   ├── signup.jsx       # User Registration Page
│   │   │                    # - Email input
│   │   │                    # - Password input & confirmation
│   │   │                    # - POST /api/users/signup
│   │   │                    # - Redirects to /orders on success
│   │   │
│   │   ├── signin.jsx       # User Login Page
│   │   │                    # - Email input
│   │   │                    # - Password input
│   │   │                    # - POST /api/users/signin
│   │   │                    # - Redirects to /orders on success
│   │   │
│   │   └── signout.jsx      # Logout Confirmation
│   │                        # - POST /api/users/signout
│   │                        # - Redirects to homepage
│   │
│   ├── orders/
│   │   ├── index.js         # User's Orders List
│   │   │                    # - GET /api/orders
│   │   │                    # - Shows all user orders
│   │   │                    # - Status: Pending, Confirmed, Cancelled
│   │   │                    # - Click to view details
│   │   │
│   │   └── [orderId].js     # Order Details & Payment
│   │                        # - GET /api/orders/:orderId
│   │                        # - Shows: order status, ticket, price
│   │                        # - If AwaitingPayment:
│   │                        #   - Stripe checkout button
│   │                        #   - 15-min timer warning
│   │                        # - If Confirmed:
│   │                        #   - "Purchase Complete" message
│   │                        # - If Cancelled:
│   │                        #   - Expired/timeout message
│   │
│   └── tickets/
│       ├── index.js         # Tickets Listing Page
│       │                    # - GET /api/tickets
│       │                    # - Display all tickets
│       │                    # - Filter by price, title (future)
│       │
│       ├── new.js           # Create New Ticket (Sell)
│       │                    # - Form: title, price
│       │                    # - POST /api/tickets
│       │                    # - Redirects to /tickets on success
│       │                    # - Auth required
│       │
│       └── [ticketId].js    # Ticket Details & Purchase
│                            # - GET /api/tickets/:id
│                            # - Shows: title, price, seller
│                            # - If not owned by user:
│                            #   - "Buy Now" button
│                            #   - Creates order
│                            #   - Redirects to /orders/:orderId
│                            # - If owned by user:
│                            #   - "Update" button (edit form)
│                            #   - PUT /api/tickets/:id
│
├── components/
│   ├── header.jsx           # Navigation Header
│   │                        # - Logo/Home link
│   │                        # - Auth Status:
│   │                        #   - If logged in: Show email, Sell, Orders, Logout links
│   │                        #   - If logged out: Sign Up, Sign In links
│   │                        # - Responsive (mobile-friendly)
│   │
│   ├── form-Container.jsx   # Form Wrapper Component
│   │                        # - Styling for form containers
│   │                        # - Consistent padding, spacing
│   │
│   ├── main-form.jsx        # Reusable Form Component
│   │                        # - Form structure
│   │                        # - Input fields
│   │                        # - Submit button
│   │
│   └── loader.jsx           # Loading Spinner
│                            # - Shows while data loading
│                            # - Reusable across pages
│
├── hooks/
│   └── use-Request.js       # Custom Axios Hook
│                            # - Simplifies HTTP requests
│                            # - Usage:
│                            #   const { doRequest, errors } = useRequest({
│                            #     method: 'post',
│                            #     url: '/api/tickets'
│                            #   });
│
├── api/
│   └── build-client.js      # Axios Client Initialization
│                            # - Configures base URL
│                            # - Adds auth headers (cookies)
│                            # - Handles errors globally
│
├── assets/
│   └── index.module.css     # CSS Modules
│                            # - Component-specific styles
│                            # - Bootstrap overrides
│                            # - Custom styling
│
├── public/
│   └── favicon.ico          # Website icon
│
├── next.config.js           # Next.js Configuration
│                            # - Environment variables
│                            # - API routes config
│                            # - Build optimization
│
├── package.json             # Dependencies
│                            # - next, react, react-dom
│                            # - axios
│                            # - bootstrap, react-bootstrap
│                            # - react-stripe-checkout
│
├── Dockerfile               # Docker configuration
│                            # - Node base image
│                            # - npm install & build
│                            # - next start
│
└── .dockerignore
```

---

## 🧪 NATS Test Service (`/nats-test`)

**Purpose**: Shared event type definitions and testing utilities

### Directory Structure
```
nats-test/
├── src/
│   ├── listener.ts          # Example event listener implementation
│   │                        # - Demonstrates how to listen to events
│   │                        # - Shows NATS subscription pattern
│   │
│   ├── publisher.ts         # Example event publisher implementation
│   │                        # - Demonstrates how to publish events
│   │                        # - Shows NATS publishing pattern
│   │
│   └── events/
│       ├── base-listener.ts # Abstract Base Class
│       │                    # interface EventListener {
│       │                    #   subject: Subjects;
│       │                    #   queueGroupName: string;
│       │                    #   onMessage(data: T, msg: Message): void;
│       │                    #   listen(): void;
│       │                    # }
│       │
│       ├── base-publisher.ts # Abstract Base Class
│       │                    # interface EventPublisher {
│       │                    #   subject: Subjects;
│       │                    #   publish(data: T): Promise<void>;
│       │                    # }
│       │
│       ├── subjects.ts      # Event Subjects Enum
│       │                    # enum Subjects {
│       │                    #   TicketCreated = 'ticket:created',
│       │                    #   OrderUpdated = 'order:updated',
│       │                    #   OrderCreated = 'order:created',
│       │                    #   OrderCancelled = 'order:cancelled',
│       │                    #   OrderExpired = 'order:expired',
│       │                    #   PaymentCreated = 'payment:created'
│       │                    # }
│       │
│       ├── ticket-created-event.ts # Event Type Definition
│       │                    # interface TicketCreatedEvent {
│       │                    #   subject: Subjects.TicketCreated;
│       │                    #   data: {
│       │                    #     id: string;
│       │                    #     title: string;
│       │                    #     price: number;
│       │                    #     userId: string;
│       │                    #     version: number;
│       │                    #   };
│       │                    # }
│       │
│       └── ticket-created-listener.ts # Listener Implementation Example
│                            # class TicketCreatedListener extends BaseListener {
│                            #   subject = Subjects.TicketCreated;
│                            #   queueGroupName = 'orders-service';
│                            #   async onMessage(data, msg) {
│                            #     // Handle ticket created
│                            #   }
│                            # }
│
├── package.json             # Dependencies
│                            # - node-nats-streaming
│                            # - TypeScript
│
├── tsconfig.json
└── .npmignore              # Used when published as npm package
```

---

## 📚 Common Library (`/common`)

**Purpose**: Shared code (npm package @wizlitickets/common)

### Purpose & Contents (Inferred from imports)

```
common/ (npm package published separately)
├── src/
│   ├── middlewares/
│   │   ├── current-user.ts     # JWT verification middleware
│   │   ├── error-handler.ts    # Global error handling
│   │   └── validate-request.ts # Input validation helpers
│   │
│   ├── errors/
│   │   ├── custom-error.ts     # Base error class
│   │   ├── bad-request-error.ts
│   │   ├── not-found-error.ts
│   │   ├── unauthorized-error.ts
│   │   ├── request-validation-error.ts
│   │   └── database-connection-error.ts
│   │
│   ├── events/
│   │   ├── base-listener.ts    # Reusable listener
│   │   ├── base-publisher.ts   # Reusable publisher
│   │   ├── subjects.ts         # Subjects enum
│   │   └── ... event types
│   │
│   ├── index.ts               # Barrel export (exports all)
│   │
│   └── types/
│       └── index.d.ts        # TypeScript type definitions
│
└── package.json
```

---

## 🛠️ Infrastructure (`/infra`)

**Purpose**: Kubernetes manifests for deployment

### Directory Structure
```
infra/
├── k8s/
│   ├── nats-depl.yaml           # NATS Streaming Server Deployment
│   │                            # - 1 replica (single instance)
│   │                            # - Port: 4222 (client connection)
│   │                            # - Service: nats-srv
│   │
│   ├── auth-depl.yaml           # Auth Service Deployment
│   │                            # - 1 replica
│   │                            # - Port: 3000
│   │                            # - Service: auth-srv
│   │                            # - Env: NATS_*, MONGODB_URI
│   │
│   ├── auth-mongo-depl.yaml     # Auth MongoDB Instance
│   │                            # - 1 replica
│   │                            # - Port: 27017
│   │                            # - Service: auth-mongo-srv
│   │
│   ├── tickets-depl.yaml        # Tickets Service
│   │                            # - 1 replica
│   │                            # - Port: 3000
│   │                            # - Service: tickets-srv
│   │
│   ├── tickets-mongo-depl.yaml  # Tickets MongoDB
│   │
│   ├── orders-depl.yaml         # Orders Service
│   │
│   ├── orders-mongo-depl.yaml   # Orders MongoDB
│   │
│   ├── payments-depl.yaml       # Payments Service
│   │                            # - Env: STRIPE_KEY (secret)
│   │
│   ├── payments-mongo-depl.yaml # Payments MongoDB
│   │
│   ├── expiration-depl.yaml     # Expiration Service (background)
│   │                            # - 1 replica
│   │                            # - No HTTP port (NATS only)
│   │                            # - Env: REDIS_URL
│   │
│   ├── expiration-redis-depl.yaml # Redis for Bull Queue
│   │                            # - 1 replica
│   │                            # - Port: 6379
│   │                            # - Service: expiration-redis-srv
│   │
│   ├── client-depl.yaml         # Client (Next.js) Deployment
│   │                            # - 1 replica
│   │                            # - Port: 3000
│   │                            # - Service: client-srv
│   │
│   └── ingress-srv.yml          # Ingress Configuration
│                               # Routes:
│                               # /api/users    → auth-srv:3000
│                               # /api/tickets  → tickets-srv:3000
│                               # /api/orders   → orders-srv:3000
│                               # /api/payments → payments-srv:3000
│                               # /             → client-srv:3000
│
└── README.md                   # Infrastructure documentation
```

---

## 📦 Configuration Files (Root)

### skaffold.yaml
```yaml
# Development configuration for hot-reload
build:
  artifacts:
    - image: abdessalamwizli/auth
      context: auth/
    - image: abdessalamwizli/tickets
      context: tickets/
    # ... all services
manifests:
  rawYaml:
    - ./infra/k8s/*
```

**Usage**: 
```bash
skaffold dev  # Builds, deploys, and watches for changes
```

### docker-compose.yml
```yaml
# Local development without Kubernetes
services:
  auth:
    build: ./auth
    ports:
      - "3001:3000"
  # ... other services
  nats:
    image: nats-streaming
  mongodb:
    image: mongo
  redis:
    image: redis
```

**Usage**:
```bash
docker-compose up --build
```

### instructions.txt
```
CLI commands for development:

kubectl cp <pod>:<path> <local-path>
kubectl exec -it <pod> sh

Optimistic Concurrency Control via "_v" field
```

---

## 🔄 Service Dependencies & Communication

### Dependency Map

```
auth-mongo ◄── auth-srv
                   │
                   │ (publishes via NATS)
                   │
          ┌────────┴─────────┬─────────────┐
          │                  │             │
          ▼                  ▼             ▼
    tickets-srv      orders-srv      payments-srv
          │                  │             │
          ├─────────────────┬┴─────────────┤
          │                 │              │
    tickets-mongo    orders-mongo   payments-mongo
          │                 │
          │         expiration-srv ◄── expiration-redis
          │                 │
          └─────────────────┴─────────────┘
                    NATS-srv
```

### Data Flow Summary

```
1. User Signup/Login
   Browser → auth-srv → auth-mongo → JWT Cookie

2. Create Ticket
   Browser → tickets-srv → tickets-mongo
   tickets-srv publishes: TicketCreated

3. Browse Tickets
   Browser ← tickets-srv ← tickets-mongo

4. Create Order
   Browser → orders-srv → orders-mongo
   orders-srv publishes: OrderCreated
   - Triggers: expiration-srv (job scheduled)
   - Triggers: payments-srv (awaits payment)

5. Process Payment
   Browser → Stripe API ← payments-srv
   payments-srv → payments-mongo
   payments-srv publishes: PaymentCreated

6. Confirm Order
   orders-srv (listens to PaymentCreated)
   → orders-mongo (update status)
   → publishes: OrderUpdated

7. Order Expires (if no payment)
   expiration-srv (job fires after 15 min)
   → publishes: ExpirationComplete
   → orders-srv cancels order
   → tickets-srv marks ticket available again
```

---

## 📊 Summary Table

| Service | Type | Port | Database | NATS Role | Purpose |
|---------|------|------|----------|-----------|---------|
| auth | HTTP | 3000 | MongoDB | - | User authentication |
| tickets | HTTP | 3000 | MongoDB | Pub/Sub | Ticket management |
| orders | HTTP | 3000 | MongoDB | Pub/Sub | Order processing |
| payments | HTTP | 3000 | MongoDB | Pub/Sub | Stripe payments |
| expiration | Background | - | - | Sub/Pub | Order expiration |
| client | Next.js | 3000 | - | - | Web frontend |
| nats-test | Types | - | - | - | Event definitions |
| common | Library | - | - | - | Shared code |

---

## 🎯 Key File Locations

| Function | File |
|----------|------|
| User authentication | `/auth/src/models/user-model.ts` |
| Password hashing | `/auth/src/services/password.ts` |
| Ticket schema | `/tickets/src/models/ticket.ts` |
| Order schema | `/orders/src/models/order-model.ts` |
| Order expiration logic | `/expiration/src/queues/expiration-queue.ts` |
| Stripe integration | `/payments/src/stripe.ts` |
| NATS listeners | `/*/src/events/listeners/` |
| NATS publishers | `/*/src/events/publishers/` |
| Event types | `/nats-test/src/events/` |
| K8s deployment | `/infra/k8s/*.yaml` |
| API routes | `/*/src/routes/` |
| Error handlers | `@wizlitickets/common/errors/` |

---

**Last Updated**: January 2026
