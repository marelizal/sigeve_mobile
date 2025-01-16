import { PaymentMethod } from '@/models/payment-method';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentMethodState {
  methods: PaymentMethod[];  // El estado debe ser un array de PaymentMethod
}

const initialState: PaymentMethodState = {
  methods: [],
};

const PaymentMethodsReducer = createSlice({
  name: 'paymentMethod',
  initialState,
  reducers: {
    // Acción para agregar múltiples métodos de pago
    addPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {  // Esperamos un array de PaymentMethod
      state.methods = action.payload;  // Reemplazamos el array de métodos de pago
    },
    clearPaymentMethods: (state) => {
      state.methods = [];  // Limpiamos los métodos de pago
    },
  },
});

export const { addPaymentMethods, clearPaymentMethods } = PaymentMethodsReducer.actions;

export default PaymentMethodsReducer.reducer;
