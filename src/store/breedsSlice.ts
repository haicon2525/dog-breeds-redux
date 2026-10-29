import { createSlice } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { fetchAllBreeds } from './breedsThunks';
import type { BreedsState } from '../types/breeds.types';

const initialState: BreedsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    // Reducer hỗ trợ reset thủ công trạng thái nếu cần
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Khi redux-persist khôi phục từ localStorage, LUÔN LUÔN ép status về 'idle'
      .addCase(REHYDRATE, (state, action: any) => {
        const persistedBreeds = action.payload?.breeds;
        if (persistedBreeds && Array.isArray(persistedBreeds.items)) {
          state.items = persistedBreeds.items;
        }
        state.status = 'idle'; // Reset status, không bao giờ để kẹt 'loading'
        state.error = null;
      })
      // 2. Các trạng thái khi gọi API
      .addCase(fetchAllBreeds.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllBreeds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Cập nhật dữ liệu mới khi thành công
        state.error = null;
      })
      .addCase(fetchAllBreeds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch breeds';
        // QUAN TRỌNG: KHÔNG xóa state.items để giữ nguyên dữ liệu cache khi lỗi / mất mạng
      });
  },
});

export const { resetStatus } = breedsSlice.actions;

export default breedsSlice.reducer;
