export const NETWORK_ERROR = 'NETWORK_ERROR';

export interface RequestOptions {
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * HTTP client wrapper: applies a 10-second timeout via AbortController
 * and catches fetch errors / offline network failures.
 */
export async function httpClient<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 10000, signal: externalSignal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    externalSignal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 10 seconds.');
      }
      if (error instanceof TypeError) {
        throw new Error(NETWORK_ERROR);
      }
      throw error;
    }
    throw new Error(NETWORK_ERROR);
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}
