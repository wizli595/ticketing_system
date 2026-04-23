# GitTix — Roadmap & TODO

## Next Up — CLI Scripts (TypeScript)

Build a modular TypeScript CLI in `scripts/` to automate repetitive microservice operations. Run via `npx tsx scripts/cli.ts <command>`.

- [ ] **CLI scaffold** — `scripts/cli.ts` entry point, command router, colored logger, exec wrapper
- [ ] **new-service** — Generate a full microservice (index.ts, app.ts, nats-wrapper, model, routes, Dockerfile, K8s manifests, test setup). Prompts: needs MongoDB? NATS? Both?
- [ ] **build-push** — `build [service|all] [--push]` — Docker build + tag (git SHA + latest) + optional push to Docker Hub
- [ ] **test** — `test [service|all] [--ci]` — Run tests across services, `--ci` for single-run (no watchAll)
- [ ] **add-listener** — `add-listener <service> <EventName>` — Scaffold NATS listener + test file, auto-wire in index.ts
- [ ] **add-route** — `add-route <service> <resource> [verb]` — Scaffold Express route + test file, auto-wire in app.ts
- [ ] **gen-k8s** — `gen-k8s <service>` — Generate K8s deployment + service YAML from shared template
- [ ] **health-check** — `health` — Quick cluster status: pod health, restarts, readiness
- [ ] **Root package.json** — Wire all commands as `npm run cli -- <command>`

## High Value — User-Facing Features

- [ ] **Pagination** — All tickets/orders load at once. Add cursor-based or offset pagination to backend + frontend.
- [ ] **Ticket categories/tags** — Add category field to ticket model (concert, sports, conference, theatre, etc.). Filter by category on search page.
- [ ] **User profile page** — `/profile` page showing email, account creation date, number of tickets listed, orders made. Option to change password.

## Medium Value — Developer & Infrastructure

- [ ] **docker-compose.yml** — Local development without Kubernetes. Compose file with all services, MongoDB instances, NATS, Redis.
- [ ] **CI/CD pipeline** — GitHub Actions workflow: run tests on PR, build Docker images on merge to master, push to registry.
- [ ] **Expiration service tests** — Only service with zero test coverage. Test the Bull queue scheduling and ExpirationComplete event publishing.
- [ ] **Common package as monorepo workspace** — Move from separate npm publish to `npm workspaces` so changes to common are immediately available to all services.
- [ ] **Structured logging** — Replace Morgan with structured JSON logging. Add correlation IDs across services for request tracing.
- [ ] **Environment variable validation** — Use a schema (zod/joi) to validate all required env vars at startup instead of manual if/throw checks.

## Nice to Have — Polish

- [ ] **Email notifications** — Send email on order created, payment success, order expired. Use a dedicated notification service.
- [ ] **Ticket images** — Upload event images/posters. S3 or similar object storage.
- [ ] **Stripe webhooks** — Replace client-side token flow with server-side webhooks for more reliable payment confirmation.
- [ ] **Rate limiting** — Add rate limiting on auth endpoints (signup/signin) to prevent brute force attacks.
- [ ] **SEO improvements** — Add Open Graph meta tags per page, generate sitemap.xml, add robots.txt.
- [ ] **PWA support** — Service worker, offline fallback page, install prompt, manifest.json.
- [ ] **Real-time updates** — WebSocket or SSE for live ticket availability and order status changes.
- [ ] **Admin dashboard** — Admin-only panel to view all users, tickets, orders, payments. Moderation tools.

## Completed

- [x] Fix "defiend" typo across all services
- [x] Fix `throw new Error()` -> `BadRequestError` in tickets update route
- [x] Pin `node:18-alpine` in all Dockerfiles
- [x] Delete orphaned client-v2 files (HeaderContent, PageLayout, ClientOnly, build-client)
- [x] Clone common package source into `/common`
- [x] Remove local PaymentCreatedEvent hacks — use proper `@wizlitickets/common` imports
- [x] Fix Header SSR auth (wrong endpoint + ThemeProvider context crash)
- [x] Remove client-side `useCurrentUser` hook — full SSR auth
- [x] Add profile dropdown in header (desktop + mobile)
- [x] Add `/tickets/my` — My Listings page with edit/delete
- [x] Add search & filter on tickets page (query, price range, sort)
- [x] Add `template.tsx` with Framer Motion page transitions
- [x] Add branded root loader (`loading.tsx`)
- [x] Add motion components (FadeIn, StaggerContainer, StaggerItem)
- [x] Redesign entire frontend with glassmorphism design system
- [x] Add toast notification system
- [x] Add cancel order support
- [x] Marketplace landing page with hero search
- [x] Enhanced navbar — scroll-aware, active links, animations, mobile backdrop
- [x] Fix K8s manifests — probes, resource limits, image tags, naming
- [x] NATS listener error handling for corrupted events
- [x] Build & push all Docker images to Docker Hub
- [x] README with screenshots
