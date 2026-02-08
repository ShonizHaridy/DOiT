// lib/server-fetch.ts - SERVER ONLY
import 'server-only';

const API_BASE_URL = process.env.API_URL || 'http://localhost:4000/api';

export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit & { revalidate?: number; tags?: string[] }
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options?.method ?? 'GET';

  let response: Response;
  try {
    response = await fetch(url, {
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
  } catch (error) {
    const message = `[serverFetch] ${method} ${url} failed: ${
      error instanceof Error ? error.message : String(error)
    }`;
    console.error(message);
    throw new Error(message);
  }

  if (!response.ok) {
    const message = `[serverFetch] ${method} ${url} -> ${response.status} ${response.statusText}`;
    console.error(message);
    throw new Error(message);
  }

  return response.json();
}
