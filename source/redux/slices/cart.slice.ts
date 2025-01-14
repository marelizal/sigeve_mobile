import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define tipos
export type CartItem = {
  id: string; // ID del producto
  name: string; // Nombre del producto
  quantity: number; // Cantidad del producto
  price_with_tax: number; // Precio del producto
};


export enum SaleType {
  DELIVERY = 'delivery',
  DIRECT = 'direct',
  PRESALE = 'presale'
}


export type Item = {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    active: boolean;
    deleted: boolean;
  };
  qty: number;
  price: number;
  subtotal: number;
};

export type CartState = {
  items: CartItem[];
  total: number; 
  isVehicleStock: boolean;
  salesType: SaleType;
};

// Estado inicial
const initialState: CartState = {
  items: [],
  total: 0,
  isVehicleStock: false,
  salesType:  SaleType.DELIVERY
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setIsVehicleStock:(state)=>{
      state.isVehicleStock = true
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity; // Incrementar la cantidad si ya existe
      } else {
        state.items.push(action.payload); // Agregar nuevo ítem
      }
      state.total += action.payload.price_with_tax * action.payload.quantity; // Actualizar total
    },
    addItemsFromOrder: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((item) => {
        const cartItem: CartItem = {
          id: item.product.id,
          name: item.product.name,
          quantity: item.qty,
          price_with_tax: item.price,
        };

        const existingItem = state.items.find(
          (cartItem) => cartItem.id === item.product.id
        );
        if (!existingItem) {
          state.items.push(cartItem); // Solo agregar nuevo ítem si no existe
        }
      });

      // Actualizar el total después de procesar todos los items
      state.total = state.items.reduce(
        (total, item) => total + item.price_with_tax * item.quantity,
        0
      );
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemToRemove = state.items.find(
        (item) => item.id === action.payload
      );
      if (itemToRemove) {
        state.total -= itemToRemove.price_with_tax * itemToRemove.quantity; // Actualizar total
        state.items = state.items.filter((item) => item.id !== action.payload); // Eliminar ítem
      }
    },
    decreaseItem: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1; // Disminuir cantidad
          state.total -= existingItem.price_with_tax; // Actualizar total
        } else {
          state.total -= existingItem.price_with_tax; // Actualizar total
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          ); // Eliminar ítem si llega a cero
        }
      }
    },
    increaseItem: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload
      );
      if (existingItem) {
        existingItem.quantity += 1; // Aumentar cantidad
        state.total += existingItem.price_with_tax; // Actualizar total
      }
    },
    clearCart: (state) => {
      state.items = []; // Limpiar carrito
      state.total = 0; // Reiniciar total
    },
    setSalesType: (state, action: PayloadAction<SaleType>) => {
      state.salesType = action.payload; // Actualiza el tipo de venta
    },
  },
});

// Extract the reducer function from the cartSlice
const cartReducer = slice.reducer;

// Export actions for the slice
export const {
  addItem,
  addItemsFromOrder,
  removeItem,
  decreaseItem,
  increaseItem,
  clearCart,
  setIsVehicleStock,
  setSalesType
} = slice.actions;

// Export the cartReducer as the default export for this module
export default cartReducer;
