import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import breedsReducer from './breedsSlice';

// Cấu hình riêng cho slice breeds: CHỈ LƯU items, KHÔNG lưu status và error vào localStorage
const breedsPersistConfig = {
  key: 'breeds',
  storage,
  blacklist: ['status', 'error'], // Không lưu trạng thái tạm thời vào ổ cứng
};

const rootReducer = combineReducers({
  breeds: persistReducer(breedsPersistConfig, breedsReducer),
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
