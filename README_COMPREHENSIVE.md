# Ticketing System - Microservices Architecture

[![Microservices](https://img.shields.io/badge/Microservices-Enabled-brightgreen.svg)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.1.1-green.svg)](https://www.mongodb.com/)
[![NATS](https://img.shields.io/badge/NATS-Streaming-orange.svg)](https://nats.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-blue.svg)](https://kubernetes.io/)
[![Next.js](https://img.shields.io/badge/Next.js-13.5.6-black.svg)](https://nextjs.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Integration-purple.svg)](https://stripe.com/)

## 📋 Overview

A modern, scalable ticketing system built with a microservices architecture. Users can create, browse, and purchase tickets while sellers can list their tickets for sale. The system includes **automated order expiration**, **secure payment processing via Stripe**, and **real-time event synchronization** across services using NATS Streaming.

### Key Features

- 🔐 **User Authentication** - Secure sign-up, sign-in, and session management
- 🎫 **Ticket Management** - Create and list tickets for sale
- 📦 **Order Processing** - Purchase tickets with automatic expiration after 15 minutes
- 💳 **Payment Integration** - Stripe-based payment processing
- ⚡ **Event-Driven Architecture** - Real-time synchronization using NATS Streaming
- 🔄 **Optimistic Concurrency Control** - Prevent race conditions using version control
- 🐳 **Containerized Deployment** - Docker and Kubernetes ready
- 🎨 **Responsive UI** - Modern Next.js frontend with Bootstrap styling

---

## 🏗️ Architecture & Technology Stack

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 13.5, React 18, Bootstrap, Axios |
| **Backend** | Node.js, Express.js 4.18, TypeScript 5.3 |
| **Database** | MongoDB 8.1, Mongoose ODM |
| **Message Broker** | NATS Streaming 0.3 |
| **Payment Processing** | Stripe 15.10 |
| **Job Queue** | Bull 4.12 (for expiration service) |
| **Orchestration** | Kubernetes, Skaffold |
| **CI/CD** | Docker, Docker Compose |
| **Testing** | Jest, Supertest, MongoDB Memory Server |
| **Logging** | Morgan, File-based Access Logs |

### Microservices Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Next.js)                       │
│                  Port: 3000 (Development)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Ingress Controller
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌──────────┐
    │  Auth  │        │Tickets │        │  Orders  │
    │ :3000  │        │ :3000  │        │  :3000   │
    └────────┘        └────────┘        └──────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                    NATS Streaming
          (Event-Driven Communication)
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌──────────┐      ┌──────────┐
    │ Payment│        │Expiration│      │ MongoDB  │
    │ :3000  │        │  :3000   │      │(Database)│
    └────────┘        └──────────┘      └──────────┘
        │                  │
        └──────────────────┼──────────────────┐
                           │                  │
                        Redis          Stripe API
                      (Job Queue)      (Payments)
```

---

## 📁 Project Structure

### Root Level
```
ticketing_system/
├── auth/                 # User Authentication Service
├── client/              # Next.js Frontend Application
├── tickets/             # Ticket Management Service
├── orders/              # Order Processing Service
├── payments/            # Payment Processing Service (Stripe)
├── expiration/          # Order Expiration Service
├── nats-test/           # Event Testing & Type Definitions
├── common/              # Shared Libraries & Common Code
├── infra/               # Infrastructure & K8s Configs
├── skaffold.yaml        # Skaffold Development Configuration
├── docker-compose.yml   # Docker Compose Setup
└── README.md           # This File
```

---

## 🔐 Auth Service (`/auth`)

**Purpose**: User authentication and session management

### Structure
```
auth/
├── src/
│   ├── app.ts              # Express app configuration with middleware
│   ├── index.ts            # Server entry point & connection setup
│   ├── models/
│   │   └── user-model.ts   # MongoDB User schema & model
│   ├── routes/
│   │   ├── signup.ts       # POST /api/users/signup - Register
│   │   ├── signin.ts       # POST /api/users/signin - Login
│   │   ├── signout.ts      # POST /api/users/signout - Logout
│   │   └── current-user.ts # GET /api/users/currentUser
│   ├── services/
│   │   └── password.ts     # Password hashing & verification (bcrypt)
│   ├── test/
│   │   └── setup.ts        # Jest test configuration
│   └── access.log          # HTTP request access log
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Key Technologies
- **Express**: REST API framework
- **Mongoose**: MongoDB ODM
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing
- **cookie-session**: Session management
- **express-validator**: Input validation

### Database
- **MongoDB Collection**: `users`
- **Fields**: `_id`, `email` (unique), `password` (hashed), `createdAt`, `updatedAt`

### API Endpoints
```
POST   /api/users/signup      - Register new user
POST   /api/users/signin      - User login
POST   /api/users/signout     - User logout
GET    /api/users/currentUser - Get current authenticated user
```

---

## 🎫 Tickets Service (`/tickets`)

**Purpose**: Ticket creation, listing, and management

### Structure
```
tickets/
├── src/
│   ├── app.ts              # Express app with NATS integration
│   ├── index.ts            # Server entry & NATS listener setup
│   ├── models/
│   │   └── ticket.ts       # MongoDB Ticket schema with versioning
│   ├── routes/
│   │   ├── create.ts       # POST /api/tickets - Create ticket
│   │   ├── index.ts        # GET /api/tickets - List all tickets
│   │   ├── show.ts         # GET /api/tickets/:id - Get ticket detail
│   │   └── update.ts       # PUT /api/tickets/:id - Update ticket
│   ├── events/
│   │   ├── listeners/      # Event listeners (OrderExpired, etc)
│   │   └── publishers/     # TicketCreated event publisher
│   ├── nats-wrapper.ts     # NATS connection wrapper
│   └── test/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Key Technologies
- **NATS Streaming**: Event publication and subscription
- **mongoose-update-if-current**: Optimistic concurrency control

### Database
- **MongoDB Collection**: `tickets`
- **Fields**:
  - `id`: Ticket identifier
  - `title`: Event/ticket name
  - `price`: Price in dollars
  - `userId`: Seller's user ID
  - `orderId`: Reference to locked order (if any)
  - `version`: Optimistic concurrency version

### Events
- **Publishes**: `TicketCreated` - when new ticket is created
- **Subscribes**: `OrderExpired`, `OrderCancelled` - marks ticket as available again

---

## 📦 Orders Service (`/orders`)

**Purpose**: Order creation and management with expiration logic

### Structure
```
orders/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Server entry point
│   ├── models/
│   │   ├── order-model.ts  # MongoDB Order schema with status enum
│   │   └── ticket-model.ts # Reference model for tickets
│   ├── routes/
│   │   ├── new.ts          # POST /api/orders - Create order
│   │   ├── index.ts        # GET /api/orders - List user orders
│   │   └── show.ts         # GET /api/orders/:id - Get order details
│   ├── events/
│   │   ├── listeners/      # PaymentCreated listener
│   │   └── publishers/     # OrderCreated & OrderUpdated publishers
│   ├── nats-wrapper.ts     # NATS connection
│   └── test/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Order Status Flow
```
┌──────────────────┐
│    Created       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│AwaitingPayment   │◄─── Expiration Timer Started (15 min)
│  (15 min timer)  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌──────────┐ ┌───────────┐
│Confirmed │ │ Cancelled │
│(Paid)    │ │(Expired)  │
└──────────┘ └───────────┘
```

### Key Features
- ⏱️ **Order Expiration**: 15-minute payment window
- 🔒 **Ticket Locking**: Prevents other purchases during payment window
- 🔄 **Event-Driven**: Listens for payment confirmation

### Database
- **MongoDB Collection**: `orders`
- **Fields**:
  - `id`: Order identifier
  - `userId`: Buyer's user ID
  - `status`: `Pending | AwaitingPayment | Confirmed | Cancelled`
  - `expiresAt`: Expiration timestamp (15 min from creation)
  - `ticket`: Reference to Ticket document
  - `version`: Optimistic concurrency version

### API Endpoints
```
POST   /api/orders     - Create new order (auth required)
GET    /api/orders     - List user's orders (auth required)
GET    /api/orders/:id - Get order details (auth required)
```

---

## 💳 Payments Service (`/payments`)

**Purpose**: Stripe payment processing and payment records

### Structure
```
payments/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Server entry point
│   ├── stripe.ts           # Stripe API wrapper & initialization
│   ├── routes/
│   │   └── new.ts          # POST /api/payments - Create charge
│   ├── models/
│   │   └── charge.ts       # MongoDB Charge schema
│   ├── events/
│   │   ├── listeners/      # OrderCreated listener
│   │   └── publishers/     # PaymentCreated event publisher
│   ├── nats-wrapper.ts     # NATS connection
│   └── test/
├── Dockerfile
├── package.json
└── tsconfig.json
```

### Key Technologies
- **Stripe SDK**: Payment processing
- **Stripe Elements**: Frontend payment form
- **Idempotency**: Prevents duplicate charges

### Database
- **MongoDB Collection**: `charges`
- **Fields**:
  - `id`: Charge identifier
  - `orderId`: Reference to order
  - `stripeId`: Stripe charge ID
  - `amount`: Amount in cents
  - `status`: Charge status
  - `createdAt`: Creation timestamp

### API Endpoints
```
POST   /api/payments   - Create payment charge (auth required)
        Body: { orderId, token, amount }
```

### Environment Variables
```
STRIPE_KEY=sk_test_... # Stripe secret API key
STRIPE_PUBLIC_KEY=pk_test_... # Stripe public key (frontend)
```

---

## ⏰ Expiration Service (`/expiration`)

**Purpose**: Handles order expiration and automatic ticket re-listing

### Structure
```
expiration/
├── src/
│   ├── index.ts                      # Server entry point
│   ├── nats-wrapper.ts               # NATS connection management
│   ├── events/
│   │   ├── listeners/
│   │   │   └── order-created-listener.ts  # Listens for new orders
│   │   └── publishers/
│   │       └── expiration-complete-publisher.ts
│   └── queues/
│       └── expiration-queue.ts       # Bull job queue configuration
├── Dockerfile
├── package.json
└── tsconfig.json
```

### How It Works

1. **Order Created Event**
   - Listens for `OrderCreated` event from Orders Service
   - Extracts order ID and expiration time (15 minutes)

2. **Create Delayed Job**
   - Bull queue stores delayed job in Redis
   - Job scheduled to run after 15 minutes

3. **Job Execution**
   ```
   After 15 minutes:
   - Check if order is still in AwaitingPayment status
   - If YES: Publish OrderExpired event
   - If NO: Job completes (order already confirmed)
   ```

4. **Event Publishing**
   - Publishes `ExpirationComplete` / `OrderExpired` event
   - Orders Service receives and updates status to `Cancelled`
   - Tickets Service receives and marks ticket as available

### Key Technologies
- **Bull**: Job queue library
- **Redis**: Persistent job storage
- **NATS Streaming**: Event communication

### Architecture
```
Order Created ──→ [Expiration Service]
                        │
                    Receives event
                        │
                    ▼
            Create Redis Job (delay: 15min)
                        │
                    ▼
            [Redis Store] (Bull keeps track)
                        │
            After 15 minutes (or on server restart)
                        │
                    ▼
            Job Executes → Check Order Status
                    │
            ┌───────┴────────┐
            │                │
      AwaitingPayment   Something Else
            │                │
            ▼                ▼
   Publish Event         Skip
   OrderExpired
```

---

## 🖥️ Client Application (`/client`)

**Purpose**: React-based frontend with Next.js

### Structure
```
client/
├── pages/
│   ├── _app.js             # Next.js root app component
│   ├── index.js            # Homepage / tickets list
│   ├── auth/
│   │   ├── signin.jsx      # Sign in page
│   │   ├── signup.jsx      # Sign up page
│   │   └── signout.jsx     # Sign out confirmation
│   ├── orders/
│   │   ├── index.js        # User's orders list
│   │   └── [orderId].js    # Order detail & payment
│   └── tickets/
│       ├── index.js        # All tickets browser
│       ├── new.js          # Create ticket form
│       └── [ticketId].js   # Ticket detail & purchase
├── components/
│   ├── header.jsx          # Navigation & user menu
│   ├── form-Container.jsx  # Form wrapper with styling
│   ├── main-form.jsx       # Reusable form component
│   └── loader.jsx          # Loading spinner
├── hooks/
│   └── use-Request.js      # Axios HTTP request hook
├── api/
│   └── build-client.js     # Axios client initialization
├── assets/
│   └── index.module.css    # CSS modules
├── next.config.js          # Next.js configuration
├── package.json
└── Dockerfile
```

### Key Technologies
- **Next.js 13.5**: React framework with SSR
- **React 18**: Component library
- **Axios**: HTTP client
- **Bootstrap 4**: UI framework
- **React Bootstrap**: Bootstrap components for React
- **React Stripe Checkout**: Stripe payment integration

### Pages Overview

| Page | Purpose | Features |
|------|---------|----------|
| `/` | Homepage | List all available tickets |
| `/auth/signup` | Registration | Create new account |
| `/auth/signin` | Login | User authentication |
| `/auth/signout` | Logout | Clear session |
| `/tickets/new` | Create ticket | Sell ticket form |
| `/tickets/[id]` | Ticket detail | View & purchase ticket |
| `/orders` | Orders list | User's purchase history |
| `/orders/[id]` | Order detail | Payment & order status |

---

## 🧪 NATS Test Service (`/nats-test`)

**Purpose**: Event type definitions and testing utilities

### Structure
```
nats-test/
├── src/
│   ├── listener.ts         # Example event listener
│   ├── publisher.ts        # Example event publisher
│   └── events/
│       ├── base-listener.ts       # Abstract base class
│       ├── base-publisher.ts      # Abstract base class
│       ├── subjects.ts            # Event subject enums
│       ├── ticket-created-event.ts       # Event type definitions
│       └── ticket-created-listener.ts    # Example listener impl
├── package.json
└── tsconfig.json
```

### Event Subjects Enum
```typescript
enum Subjects {
    TicketCreated = 'ticket:created',
    OrderUpdated = 'order:updated',
    OrderCreated = 'order:created',
    OrderCancelled = 'order:cancelled',
    OrderExpired = 'order:expired',
    PaymentCreated = 'payment:created',
    PaymentFailed = 'payment:failed'
}
```

---

## 🛠️ Infrastructure (`/infra`)

**Purpose**: Kubernetes deployment configurations

### Kubernetes Manifests
```
infra/k8s/
├── nats-depl.yaml              # NATS Streaming server
├── auth-depl.yaml              # Auth service deployment
├── auth-mongo-depl.yaml        # Auth MongoDB instance
├── tickets-depl.yaml           # Tickets service deployment
├── tickets-mongo-depl.yaml     # Tickets MongoDB instance
├── orders-depl.yaml            # Orders service deployment
├── orders-mongo-depl.yaml      # Orders MongoDB instance
├── payments-depl.yaml          # Payments service deployment
├── payments-mongo-depl.yaml    # Payments MongoDB instance
├── expiration-depl.yaml        # Expiration service (background)
├── expiration-redis-depl.yaml  # Redis for Bull job queue
├── client-depl.yaml            # Client (Next.js) deployment
└── ingress-srv.yml             # Ingress routing configuration
```

### Service Networking
```
Host: ticketing.local (via /etc/hosts or DNS)

ticketing.local:80
    │
    └─→ Ingress Controller
        │
        ├─→ /          → client-srv:3000
        ├─→ /api/users → auth-srv:3000
        ├─→ /api/tickets → tickets-srv:3000
        ├─→ /api/orders → orders-srv:3000
        └─→ /api/payments → payments-srv:3000
```

---

## 🔄 Event-Driven Communication (NATS Streaming)

### Event Types & Flow

```
1. TicketCreated
   Source: Tickets Service
   Subscribers: Orders Service
   Payload: { id, title, price, userId, version }

2. OrderCreated
   Source: Orders Service
   Subscribers: Expiration Service, Payments Service
   Payload: { id, userId, ticketId, expiresAt, version }

3. OrderExpired / OrderCancelled
   Source: Expiration Service / Orders Service
   Subscribers: Tickets Service
   Payload: { id, orderId, ticketId, version }
   Effect: Ticket status → Available

4. PaymentCreated
   Source: Payments Service
   Subscribers: Orders Service
   Payload: { id, orderId, stripeId, amount, version }
   Effect: Order status → Confirmed
```

### Event Flow Diagram

```
[Tickets Service]
  │
  ├─→ Create Ticket
  │   └─→ Publish: TicketCreated
  │
[Orders Service] ◄── TicketCreated
  │
  ├─→ Create Order
  │   └─→ Publish: OrderCreated
  │
  ├─→ Lock Ticket (orderId)
  │
[Expiration Service] ◄── OrderCreated
  │
  ├─→ Queue Delayed Job (15 min)
  │
[Payments Service] ◄── OrderCreated
  │
  ├─→ Ready to Process Payment
  │
[User Browser]
  │
  ├─→ Complete Payment
  │   └─→ POST /api/payments
  │
[Payments Service]
  │
  ├─→ Charge with Stripe
  │   └─→ Publish: PaymentCreated
  │
[Orders Service] ◄── PaymentCreated
  │
  ├─→ Update Order status → Confirmed
  └─→ Ticket stays locked

─── OR IF TIMEOUT ───

[Expiration Service] (15 min elapsed)
  │
  ├─→ Job Executes
  │   └─→ Publish: OrderExpired
  │
[Orders Service] ◄── OrderExpired
  │
  ├─→ Update Order status → Cancelled
  └─→ Publish: OrderCancelled
  │
[Tickets Service] ◄── OrderCancelled
  │
  ├─→ Clear orderId field
  └─→ Ticket available again!
```

---

## 🎯 Solution: The Problem It Solves

### The Problem

**Traditional Ticketing System Challenges:**

1. **Order Locking Issues**
   - User A purchases ticket → ticket locked
   - User A abandons purchase (changes mind, payment fails)
   - Ticket remains locked indefinitely
   - User B cannot buy the locked ticket
   - Seller's ticket is lost

2. **No Recovery Mechanism**
   - Manual intervention required to unlock
   - Seller must contact admin
   - Time-consuming and error-prone
   - Bad user experience

3. **Inventory Loss**
   - Sellers lose revenue due to locked tickets
   - Buyers frustration when can't access locked tickets
   - Unpredictable inventory availability

### Our Solution: Intelligent Expiration-Based Re-listing

#### How It Works:

```
Timeline:
─────────────────────────────────────────────

T=0min      T=7min        T=15min
│           │             │
├─User Creates Order
│ ├─ Status: AwaitingPayment
│ ├─ Ticket Locked
│ └─ 15-min Timer Started
│
│           ├─ User Makes Payment
│           │ ├─ Status: Confirmed
│           │ ├─ Ticket Stays Locked
│           │ └─ Expiration Timer Cancelled
│
│           └─ Or: No Payment Yet
│             └─ Still AwaitingPayment
│
│                       ├─ 15 Minutes Elapsed!
│                       ├─ Order Status: Cancelled
│                       ├─ Ticket Status: Available
│                       └─ OTHER USERS CAN BUY IT NOW!
```

#### Key Features:

✅ **Automatic Recovery**
- No manual intervention needed
- Completely automated process
- Background service handles it

✅ **Fair Access**
- Clear 15-minute payment window
- Users know exactly how much time they have
- No indefinite locking

✅ **Seller Friendly**
- Get multiple chances to sell same ticket
- No lost revenue from locked tickets
- Automatic re-listing is transparent

✅ **Buyer Friendly**
- Clear, generous time window (15 minutes)
- Can retry payment if it fails
- Session remains active during payment

✅ **System Resilient**
- Works even if payment gateway is slow
- Works during server restarts (Redis persistence)
- Prevents double-charging via idempotency

#### Real-World Scenario:

```
Scenario A: User Completes Payment
──────────────────────────────────
1. User clicks "Buy Ticket"
2. Order created (status: AwaitingPayment)
3. [Expiration] Job scheduled: 15 minutes
4. User enters Stripe payment details
5. Payment completes in 2 minutes
6. [Payments] Service confirms payment
7. Order status → Confirmed ✅
8. Ticket locked permanently to this user
9. [Expiration] Service cancels the job
   (or lets it complete harmlessly)

Scenario B: User Abandons Purchase
───────────────────────────────────
1. User clicks "Buy Ticket"
2. Order created (status: AwaitingPayment)
3. [Expiration] Job scheduled: 15 minutes
4. User gets distracted, doesn't pay
5. 15 minutes pass...
6. [Expiration] Job executes
7. Order status → Cancelled ❌
8. Ticket status → Available again ✅
9. Someone else can now purchase!

Scenario C: Payment Fails Initially
────────────────────────────────────
1. User attempts payment
2. Card declined - payment fails
3. Still within 15-minute window
4. User can retry payment immediately
5. If retry successful: Order confirmed ✅
6. If no retry: Ticket auto-released after 15 min
```

---

## 📊 Database Schemas

### User (Auth Service)
```javascript
{
  _id: ObjectId,
  email: String,          // Unique, indexed
  password: String,       // Hashed with bcrypt
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Ticket (Tickets Service)
```javascript
{
  _id: ObjectId,
  id: String,            // Mapped from _id in JSON
  title: String,         // Event/ticket name
  price: Number,         // In dollars
  userId: String,        // Seller's ID
  orderId: String,       // Buyer's order (if locked)
  version: Number,       // Optimistic concurrency
  createdAt: Date,
  updatedAt: Date
}
```

### Order (Orders Service)
```javascript
{
  _id: ObjectId,
  id: String,            // Mapped from _id in JSON
  userId: String,        // Buyer's ID
  status: String,        // 'Pending' | 'AwaitingPayment' | 'Confirmed' | 'Cancelled'
  expiresAt: Date,       // Typically 15 minutes from creation
  ticket: ObjectId,      // Reference to Ticket
  version: Number,       // Optimistic concurrency
  createdAt: Date,
  updatedAt: Date
}
```

### Charge (Payments Service)
```javascript
{
  _id: ObjectId,
  id: String,            // Mapped from _id in JSON
  orderId: String,       // Reference to order
  stripeId: String,      // Stripe charge ID
  amount: Number,        // In cents (e.g., 50000 = $500.00)
  status: String,        // 'succeeded' | 'failed' | 'pending'
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14+ (recommended: 18 LTS)
- **npm** or **yarn**
- **Docker** & Docker Desktop
- **Kubernetes** (Docker Desktop K8s or Minikube)
- **Skaffold** CLI
- **kubectl** command-line tool
- **MongoDB** (Atlas cloud or local)
- **Redis** (for Bull queue, local or cloud)
- **Stripe** account (for payment testing)

### Installation & Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ticketing_system
```

#### 2. Install Dependencies (All Services)
```bash
# Auth Service
cd auth && npm install && cd ..

# Tickets Service
cd tickets && npm install && cd ..

# Orders Service
cd orders && npm install && cd ..

# Payments Service
cd payments && npm install && cd ..

# Expiration Service
cd expiration && npm install && cd ..

# Client Application
cd client && npm install && cd ..

# NATS Test Utils
cd nats-test && npm install && cd ..
```

#### 3. Environment Configuration

Create `.env` files in each service directory:

**`auth/.env`**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/auth
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
PORT=3000
```

**`tickets/.env`**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tickets
NATS_URL=nats://nats-srv:4222
NATS_CLUSTER_ID=ticketing
NATS_CLIENT_ID=tickets-service
NODE_ENV=development
PORT=3000
```

**`orders/.env`**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/orders
NATS_URL=nats://nats-srv:4222
NATS_CLUSTER_ID=ticketing
NATS_CLIENT_ID=orders-service
NODE_ENV=development
PORT=3000
```

**`payments/.env`**
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/payments
STRIPE_KEY=sk_test_... # Get from Stripe dashboard
NATS_URL=nats://nats-srv:4222
NATS_CLUSTER_ID=ticketing
NATS_CLIENT_ID=payments-service
NODE_ENV=development
PORT=3000
```

**`expiration/.env`**
```
NATS_URL=nats://nats-srv:4222
NATS_CLUSTER_ID=ticketing
NATS_CLIENT_ID=expiration-service
REDIS_URL=redis://redis:6379
NODE_ENV=development
```

**`client/.env.local`**
```
NEXT_PUBLIC_API_URL=http://ticketing.local
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_... # Get from Stripe dashboard
```

#### 4. Kubernetes & Skaffold Setup

```bash
# Verify kubectl context
kubectl config current-context
# Should show: docker-desktop or minikube

# Start with Skaffold
skaffold dev

# Skaffold will:
# ✓ Build all Docker images
# ✓ Deploy to Kubernetes
# ✓ Stream logs from all pods
# ✓ Enable hot reload on file changes
```

#### 5. Access the Application

Add to `/etc/hosts` (Windows: `C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 ticketing.local
```

Open browser: `http://ticketing.local`

### Running Tests

```bash
# Auth Service tests
cd auth && npm test

# Tickets Service tests
cd tickets && npm test

# Orders Service tests
cd orders && npm test

# Payments Service tests
cd payments && npm test
```

### Production Deployment

```bash
# Build Docker images
docker build -t your-registry/auth ./auth
docker build -t your-registry/tickets ./tickets
docker build -t your-registry/orders ./orders
docker build -t your-registry/payments ./payments
docker build -t your-registry/expiration ./expiration
docker build -t your-registry/client ./client

# Push to registry (e.g., Docker Hub)
docker push your-registry/auth
docker push your-registry/tickets
# ... push all services

# Update image names in Kubernetes manifests
# Then deploy:
kubectl apply -f infra/k8s/
```

---

## 🔐 Advanced Features

### Optimistic Concurrency Control

**Problem**: Race conditions when multiple requests modify the same document

**Solution**: Version field tracking

```typescript
// User 1 fetches ticket (v=1)
const ticket = await Ticket.findById(id);  // version: 1

// User 2 fetches same ticket (v=1)
const ticket2 = await Ticket.findById(id); // version: 1

// User 2 updates first (succeeds)
await Ticket.findByIdAndUpdate(id, { price: 50 }, { versionKey: 'version' });
// Document now at version: 2

// User 1 tries to update (FAILS!)
// Update query requires version: 1, but document is at version: 2
await Ticket.updateOne({ _id: id, version: 1 }, { price: 60 });
// MongoError: No document matched the query
```

**Implementation**: `mongoose-update-if-current` plugin

```typescript
ticketSchema.plugin(updateIfCurrentPlugin);

// Now updates are version-safe
await ticket.save(); // Only succeeds if version hasn't changed
```

**Prevents**:
- Double-charging (payment processed twice)
- Duplicate order creation
- Conflicting updates across services

---

### Error Handling

Global error handler with standardized responses:

```typescript
class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

// Throws caught by middleware
throw new AppError('Ticket not found', 404);
throw new AppError('Unauthorized', 401);
throw new AppError('Bad request', 400);

// Standardized response
{
  "errors": [
    {
      "message": "Ticket not found",
      "field": "id"
    }
  ]
}
```

---

### Request Validation

Input validation with `express-validator`:

```typescript
router.post('/api/tickets',
  [
    body('title').notEmpty().withMessage('Title required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be > 0')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process valid request
  }
);
```

---

### Logging

**Morgan**: HTTP request logging
```
GET /api/tickets 200 5ms
POST /api/orders 201 42ms
POST /api/payments 500 1200ms
```

**File-based Logs**: `access.log` in each service
```bash
# View auth logs
cat auth/access.log

# Follow logs in real-time
tail -f auth/access.log
```

---

## 📈 API Endpoints

### Auth Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/users/signup` | Register new user | ❌ |
| POST | `/api/users/signin` | User login | ❌ |
| POST | `/api/users/signout` | User logout | ✅ |
| GET | `/api/users/currentUser` | Get current user | ✅ |

### Tickets Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/tickets` | List all tickets | ❌ |
| GET | `/api/tickets/:id` | Get ticket details | ❌ |
| POST | `/api/tickets` | Create ticket | ✅ |
| PUT | `/api/tickets/:id` | Update ticket | ✅ (owner only) |

### Orders Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/orders` | List user's orders | ✅ |
| GET | `/api/orders/:id` | Get order details | ✅ |
| POST | `/api/orders` | Create order | ✅ |

### Payments Service

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/payments` | Create payment | ✅ |

---

## 🛠️ Troubleshooting

### NATS Connection Errors

```bash
# Check NATS pod
kubectl get pods | grep nats
kubectl describe pod nats-depl-xxx

# View NATS logs
kubectl logs nats-depl-xxx

# Restart NATS
kubectl delete pod nats-depl-xxx
```

### MongoDB Connection Issues

```bash
# Check MongoDB connection string
echo $MONGODB_URI

# Test connection
mongosh $MONGODB_URI

# View MongoDB logs
kubectl logs <mongo-pod-name>
```

### Skaffold Issues

```bash
# Clean and rebuild
skaffold delete
skaffold dev --rebuild-strategy=always

# Debug mode
skaffold debug

# Check specific service
kubectl logs <service-pod-name>
```

### Payment Processing Issues

```bash
# Check Stripe API key is valid
echo $STRIPE_KEY

# Monitor payment service logs
kubectl logs payments-depl-xxx

# Test Stripe API
curl -X POST https://api.stripe.com/v1/charges \
  -u sk_test_xxx: \
  -d amount=2000
```

---

## 📝 Common Workflows

### Creating & Selling a Ticket

1. **Sign In** → `POST /api/users/signin`
2. **Navigate to** `http://ticketing.local/tickets/new`
3. **Fill Form**:
   - Title: "Concert Tickets"
   - Price: "$50"
4. **Submit** → `POST /api/tickets`
5. ✅ Ticket appears in marketplace immediately

### Purchasing a Ticket

1. **Browse Tickets** → `http://ticketing.local`
2. **Select Ticket** → Click "Purchase"
3. **Navigate to** `/tickets/[ticketId]`
4. **Click "Pay"** → Stripe checkout opens
5. **Enter Test Card**: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC
6. **Complete Payment** within 15 minutes
7. ✅ Order confirmed, ticket locked to you

### Viewing Your Orders

1. **Navigate to** `http://ticketing.local/orders`
2. **See All Orders**:
   - Pending (awaiting payment)
   - Confirmed (paid)
   - Cancelled (expired)

### Cancelling a Purchase

**Scenario**: You create an order but DON'T pay

1. Order created with 15-min expiration timer
2. You close browser without paying
3. Wait 15 minutes...
4. [Expiration Service] marks order as cancelled
5. Ticket automatically becomes available again
6. Someone else can now purchase

---

## 🔄 Data Flow Example

### Complete Purchase Flow

```
┌─ User Interaction ─────────────────────────────────────────┐
│                                                              │
│  1. Browse tickets (GET /api/tickets)                       │
│  2. Click "Buy"                                             │
│  3. Create order (POST /api/orders)                         │
│  4. Receive Stripe token                                    │
│  5. Enter payment details in Stripe form                    │
│  6. Submit (POST /api/payments)                             │
│  7. Payment processed                                       │
│  8. Order confirmed                                         │
│                                                              │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌─────── Backend Processing ───────┐
        │                                   │
        │  [Client]                         │
        │  POST /api/tickets                │
        │    └─→ [Tickets Service]          │
        │         Create & save             │
        │         Publish TicketCreated     │
        │                                   │
        │  [Orders Service]                 │
        │    ◀── TicketCreated event        │
        │    Cache ticket data              │
        │                                   │
        │  POST /api/orders                 │
        │    └─→ [Orders Service]           │
        │         Create order              │
        │         Lock ticket               │
        │         Publish OrderCreated      │
        │                                   │
        │  [Expiration Service]             │
        │    ◀── OrderCreated event         │
        │    Queue 15-min job               │
        │                                   │
        │  [Payments Service]               │
        │    ◀── OrderCreated event         │
        │    Ready for charge               │
        │                                   │
        │  POST /api/payments               │
        │    └─→ [Payments Service]         │
        │         Stripe.charges.create()   │
        │         Save to DB                │
        │         Publish PaymentCreated    │
        │              │                    │
        │              ▼ Stripe API         │
        │         💳 Process charge         │
        │              │                    │
        │  [Orders Service]                 │
        │    ◀── PaymentCreated event       │
        │    Update status → Confirmed      │
        │    Cancel expiration job          │
        │                                   │
        └───────────────────────────────────┘
                       │
                       ▼
        ✅ Order complete, ticket locked!
```

---

## 📚 Additional Resources

- **[Skaffold Documentation](https://skaffold.dev/)** - K8s development workflow
- **[Kubernetes Best Practices](https://kubernetes.io/docs/concepts/)** - K8s patterns
- **[NATS Streaming Docs](https://docs.nats.io/)** - Event messaging
- **[Mongoose Guide](https://mongoosejs.com/)** - MongoDB ODM
- **[Express.js Tutorial](https://expressjs.com/)** - Web framework
- **[Next.js Docs](https://nextjs.org/docs)** - React framework
- **[Stripe API Reference](https://stripe.com/docs/api)** - Payment processing
- **[Bull Queue Docs](https://optimalbits.github.io/bull/)** - Job queue
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Type safety

---

## 📄 License

**ISC License** - See [LICENSE](LICENSE) file for details

---

## 👤 Author

**Abdessalam Wizli**

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support & Issues

For bugs, features, or questions:
- Open an [Issue](https://github.com/yourrepo/issues)
- Check [Troubleshooting](#troubleshooting) section
- Review [FAQ](#faq)

---

## 🎓 Learning Resources

### Microservices Concepts
- Service-to-service communication
- Event-driven architecture
- Distributed transactions
- Data consistency patterns

### Specific Technologies
- Docker containerization
- Kubernetes orchestration
- NATS event streaming
- MongoDB document modeling
- Stripe payment APIs

---

**Last Updated**: January 2026
**Status**: ✅ Production Ready
