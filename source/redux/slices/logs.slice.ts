import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LogsState {
  messages: string[];
}

const initialState: LogsState = {
  messages: [],
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLogMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
    clearLogs: (state) => {
      state.messages = [];
    },
  },
});

export const { addLogMessage, clearLogs } = logsSlice.actions;

export default logsSlice.reducer;
