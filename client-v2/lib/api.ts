import axios from 'axios';

export interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  version: number;
  userId: string;
  status: 'created' | 'complete' | 'cancelled' | 'awaiting:payment';
  ticket: Ticket;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  currentUser: CurrentUser;
}

const isServer = typeof window === 'undefined';
const API_BASE_URL = isServer
  ? (process.env.CLUSTER_URL || 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local')
  : (process.env.NEXT_PUBLIC_API_URL || '/');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: isServer
    ? { Host: process.env.INGRESS_HOST || 'ticketing.dev' }
    : undefined,
});

export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await apiClient.get('/api/tickets');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return [];
  }
}

export async function fetchTicketById(ticketId: string): Promise<Ticket | null> {
  try {
    const response = await apiClient.get(`/api/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ticket:', error);
    return null;
  }
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await apiClient.get('/api/orders');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await apiClient.get<AuthResponse>('/api/users/current');
    return response.data.currentUser;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

export default apiClient;
