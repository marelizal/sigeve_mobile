import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/models/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  selectedClientId: number | null;
}

const initialState: CartState = {
  items: [],
  selectedClientId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(item => item.product.id === action.payload);
      if (index !== -1) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity--;
        } else {
          state.items.splice(index, 1);
        }
      }
    },
    setSelectedClient: (state, action: PayloadAction<number | null>) => {
      state.selectedClientId = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, setSelectedClient } = cartSlice.actions;
export default cartSlice.reducer;

