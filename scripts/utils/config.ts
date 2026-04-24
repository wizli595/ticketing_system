import path from 'path';

export const ROOT = path.resolve(__dirname, '..', '..');

export const DOCKER_USER = 'abdessalamwizli';

export const SERVICES = ['auth', 'tickets', 'orders', 'payments', 'expiration', 'categories', 'client-v2'] as const;

export type ServiceName = (typeof SERVICES)[number];

export const BACKEND_SERVICES = ['auth', 'tickets', 'orders', 'payments', 'expiration', 'categories'] as const;

export type BackendServiceName = (typeof BACKEND_SERVICES)[number];

// Services that use NATS
export const NATS_SERVICES = ['tickets', 'orders', 'payments', 'expiration', 'categories'] as const;

// Services that use MongoDB
export const MONGO_SERVICES = ['auth', 'tickets', 'orders', 'payments', 'categories'] as const;

export function servicePath(name: string): string {
  return path.join(ROOT, name);
}

export function k8sPath(): string {
  return path.join(ROOT, 'infra', 'k8s');
}

export function templatesPath(): string {
  return path.join(__dirname, '..', 'templates');
}

export function isValidService(name: string): name is ServiceName {
  return (SERVICES as readonly string[]).includes(name);
}

export function isBackendService(name: string): name is BackendServiceName {
  return (BACKEND_SERVICES as readonly string[]).includes(name);
}
