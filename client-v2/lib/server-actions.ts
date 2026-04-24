 'use server';
 /**
 * Server-side data fetching functions
 * These are used by Server Components for SSR
 */

import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { Ticket, Order, Category } from '@/lib/api';

const isServer = typeof window === 'undefined';
const ingressBase = process.env.CLUSTER_URL || 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
const publicBase = process.env.NEXT_PUBLIC_API_URL || '/';

async function buildAxios() {
  if (!isServer) {
    return axios.create({ baseURL: publicBase, withCredentials: true });
  }

  // This runs at request time, so cookies() is safe here.
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  console.log('[buildAxios] Session cookie present:', !!sessionCookie);
  
  return axios.create({
    baseURL: ingressBase,
    withCredentials: true,
    headers: {
      ...(sessionCookie ? { Cookie: `session=${sessionCookie}` } : {}),
      Host: process.env.INGRESS_HOST || 'ticketing.dev',
    },
  });
}

function isAxiosError(error: unknown): error is AxiosError {
  return !!error && typeof error === 'object' && 'isAxiosError' in error;
}

  
/**
 * Fetch all available tickets
 */
export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const client = await buildAxios();
    const response = await client.get('/api/tickets');
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return [];
    }
    console.error('Error fetching tickets:', error);
    return [];
  }
}

/**
 * Fetch a specific ticket by ID
 */
export async function fetchTicket(ticketId: string): Promise<Ticket | null> {
  try {
    const client = await buildAxios();
    const response = await client.get(`/api/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && [401, 404].includes(error.response?.status ?? 0)) {
      return null;
    }
    console.error('Error fetching ticket:', error);
    return null;
  }
}

/**
 * Fetch the current user from the auth service
 */
export async function fetchCurrentUser(): Promise<{ id: string; email: string } | null> {
  try {
    const client = await buildAxios();
    const response = await client.get('/api/users/current');
    return response.data.currentUser || null;
  } catch {
    return null;
  }
}

/**
 * Fetch tickets listed by the current user
 */
export async function fetchMyTickets(): Promise<Ticket[]> {
  try {
    const user = await fetchCurrentUser();
    if (!user) return [];
    const allTickets = await fetchTickets();
    return allTickets.filter((t) => t.userId === user.id);
  } catch {
    return [];
  }
}

/**
 * Update a ticket
 */
export async function updateTicket(
  ticketId: string,
  data: { title: string; price: number }
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await buildAxios();
    await client.put(`/api/tickets/${ticketId}`, data);
    return { success: true };
  } catch (error: any) {
    const msg = error?.response?.data?.errors?.[0]?.message || 'Failed to update ticket';
    return { success: false, error: msg };
  }
}

/**
 * Delete a ticket
 */
export async function deleteTicket(
  ticketId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await buildAxios();
    await client.delete(`/api/tickets/${ticketId}`);
    return { success: true };
  } catch (error: any) {
    const msg = error?.response?.data?.errors?.[0]?.message || 'Failed to delete ticket';
    return { success: false, error: msg };
  }
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const client = await buildAxios();
    const response = await client.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch all orders for the current user
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const client = await buildAxios();
    const response = await client.get('/api/orders');
    console.log('[fetchOrders] Success', response.status, response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('[fetchOrders] Error', error.response?.status, error.response?.statusText);
      if (error.response?.status === 401) {
        return [];
      }
    } else {
      console.error('[fetchOrders] Non-axios error:', error);
    }
    return [];
  }
}
