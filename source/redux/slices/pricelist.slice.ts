import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pricelist } from '@/models/pricelist';

interface PriceListState {
  priceLists: Pricelist[];
}

const initialState: PriceListState = {
  priceLists: [],
};

const priceListSlice = createSlice({
  name: 'priceList',
  initialState,
  reducers: {
    setPriceLists: (state, action: PayloadAction<Pricelist[]>) => {
      state.priceLists = action.payload;
    },
  },
});

export const { setPriceLists } = priceListSlice.actions;
export default priceListSlice.reducer;

