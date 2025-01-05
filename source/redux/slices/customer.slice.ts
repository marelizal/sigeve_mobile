import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '@/models/customer';


interface CustomerState {
  customers: Customer[];
  selectedCustomerId: number | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomerId: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },
    setSelectedCustomer: (state, action: PayloadAction<number | null>) => {
      state.selectedCustomerId = action.payload;
    },
  },
});

export const { setCustomers, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;

