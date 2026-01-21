/**
 * Server-side data fetching functions
 * These are used by Server Components for SSR
 */

import { Ticket, Order } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

/**
 * Fetch all available tickets
 */
export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch(`${API_URL}/api/tickets`, {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

/**
 * Fetch a specific ticket by ID
 */
export async function fetchTicket(ticketId: string): Promise<Ticket | null> {
  try {
    const response = await fetch(`${API_URL}/api/tickets/${ticketId}`, {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

/**
 * Fetch all orders for the current user
 */
export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
