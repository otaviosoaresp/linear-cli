import { LinearClient } from '@linear/sdk';
import { getApiKey } from './config';

let cachedClient: LinearClient | null = null;

export function getLinearClient(): LinearClient {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('No API key found. Run "linear auth login" to configure.');
  }

  if (!cachedClient) {
    cachedClient = new LinearClient({ apiKey });
  }

  return cachedClient;
}

export function clearClientCache(): void {
  cachedClient = null;
}
