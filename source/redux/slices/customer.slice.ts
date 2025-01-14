import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '@/models/customer';
import { RootState } from '../store';


interface CustomerState {
  customers: Customer[];
  selectedCustomerId: string | null;
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
    setSelectedCustomer: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerId = action.payload;
    },
  },
});

export const selectCustomerById = (state: RootState, id: string) =>
  state.customers.customers.find((customer) => customer.id === id);

export const selectSelectedCustomer = createSelector(
  (state: RootState) => state.customers.customers,
  (state: RootState) => state.customers.selectedCustomerId,
  (customers, selectedCustomerId) =>
    customers.find((customer) => customer.id === selectedCustomerId) || null
);

export const { setCustomers, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;

