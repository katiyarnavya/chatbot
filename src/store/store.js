import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'chat-storage',
  storage,
  whitelist: ['messages', 'settings'], // Only persist these fields
  blacklist: ['isTyping', 'messageStatuses', 'userStatus'], // Don't persist these fields
};

const persistedReducer = persistReducer(persistConfig, chatReducer);

export const store = configureStore({
  reducer: {
    chat: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store); 