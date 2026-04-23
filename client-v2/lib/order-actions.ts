'use server';

import { Order } from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

// const isServer = typeof window === 'undefined';
const ingressBase = process.env.CLUSTER_URL || 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';

async function buildAxios() {
  const cookieStore = await  cookies();
  const sessionCookie = cookieStore.get('session')?.value;

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

export async function fetchOrder(orderId: string): Promise<Order | null> {
  try {
    const client = await buildAxios();
    const response = await client.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && [401, 404].includes(error.response?.status ?? 0)) {
      return null;
    }
    console.error('Error fetching order:', error);
    return null;
  }
}

export async function processPayment(
  token: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await buildAxios();
    const response = await client.post('/api/payments', {
      token,
      orderId,
    });

    if (response.status === 201) {
      return { success: true };
    }
    return { success: false, error: 'Payment failed' };
  } catch (error: any) {
    console.error('Payment error:', error);
    const errorMessage = error.response?.data?.errors?.[0] || 'Payment processing failed';
    return { success: false, error: errorMessage };
  }
}
