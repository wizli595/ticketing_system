 'use server';
 /**
 * Server-side data fetching functions
 * These are used by Server Components for SSR
 */

import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { Ticket, Order, Category, PaginatedResponse } from '@/lib/api';

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
 * Fetch tickets with pagination
 */
export async function fetchTickets(page = 1, limit = 20): Promise<{ tickets: Ticket[]; total: number; totalPages: number; page: number }> {
  try {
    const client = await buildAxios();
    const response = await client.get(`/api/tickets?page=${page}&limit=${limit}`);
    const data = response.data;
    return {
      tickets: data.tickets || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return { tickets: [], total: 0, totalPages: 1, page: 1 };
    }
    console.error('Error fetching tickets:', error);
    return { tickets: [], total: 0, totalPages: 1, page: 1 };
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
    // Fetch a large page to get all user's tickets
    const { tickets } = await fetchTickets(1, 50);
    return tickets.filter((t) => t.userId === user.id);
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
 * Fetch orders with pagination
 */
export async function fetchOrders(page = 1, limit = 20): Promise<{ orders: Order[]; total: number; totalPages: number; page: number }> {
  try {
    const client = await buildAxios();
    const response = await client.get(`/api/orders?page=${page}&limit=${limit}`);
    const data = response.data;
    return {
      orders: data.orders || [],
      total: data.total || 0,
      totalPages: data.totalPages || 1,
      page: data.page || 1,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        return { orders: [], total: 0, totalPages: 1, page: 1 };
      }
    }
    console.error('Error fetching orders:', error);
    return { orders: [], total: 0, totalPages: 1, page: 1 };
  }
}
