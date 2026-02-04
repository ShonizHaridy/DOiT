// lib/server-fetch.ts - SERVER ONLY
import 'server-only';

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000';

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number; tags?: string[] }
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    next: {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags,
    },
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  return response.json();
}