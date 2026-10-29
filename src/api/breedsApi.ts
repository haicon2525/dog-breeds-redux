import { httpClient } from './httpClient';
import type { BreedResource, BreedsApiResponse } from '../types/breeds.types';

const BREEDS_API_URL = 'https://dogapi.dog/api/v2/breeds';

/**
 * Breeds API service: iterates through pagination links.next to fetch all breeds
 */
export const breedsApi = {
  async getAllBreeds(signal?: AbortSignal): Promise<BreedResource[]> {
    let nextUrl: string | null = BREEDS_API_URL;
    const allBreeds: BreedResource[] = [];

    // Follow links.next until all pages are retrieved
    while (nextUrl) {
      const res: BreedsApiResponse = await httpClient<BreedsApiResponse>(nextUrl, {
        signal,
        timeoutMs: 10000,
      });

      if (Array.isArray(res.data)) {
        allBreeds.push(...res.data);
      }

      nextUrl = res.links?.next || null;
    }

    return allBreeds;
  },
};
