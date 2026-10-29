import { createAsyncThunk } from '@reduxjs/toolkit';
import { breedsApi } from '../api/breedsApi';
import { NETWORK_ERROR } from '../api/httpClient';
import type { BreedResource, BreedsState } from '../types/breeds.types';

/**
 * AsyncThunk fetchAllBreeds
 */
export const fetchAllBreeds = createAsyncThunk<
  BreedResource[],
  void,
  { state: { breeds: BreedsState }; rejectValue: string }
>(
  'breeds/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await breedsApi.getAllBreeds(signal);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === NETWORK_ERROR) {
          return rejectWithValue('Network Error: Mất kết nối Internet.');
        }
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi không xác định.');
    }
  }
);
