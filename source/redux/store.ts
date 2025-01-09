import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


import authReducer from './slices/auth.slice';
import customerReducer from './slices/customer.slice';
import productReducer from './slices/product.slice';
import priceListReducer from './slices/pricelist.slice';
import cartReducer from './slices/cart.slice';
import roadmapReducer from './slices/roadmap.slice';
import logsReducer from './slices/logs.slice';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // You can add specific reducers to the blacklist if you don't want to persist them
  // blacklist: ['someReducer']
};

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  products: productReducer,
  priceList: priceListReducer,
  cart: cartReducer,
  roadmap: roadmapReducer,
  logs: logsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
