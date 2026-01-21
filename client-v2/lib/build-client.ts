import axios, { AxiosInstance } from 'axios';
import { GetServerSidePropsContext } from 'next';

interface BuildClientContext {
  req?: GetServerSidePropsContext['req'];
}

export function buildClient(context?: BuildClientContext): AxiosInstance {
  if (typeof window === 'undefined') {
    // Server-side
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: context?.req?.headers,
    });
  }

  // Client-side
  return axios.create({
    baseURL: '/',
  });
}

export default buildClient;
