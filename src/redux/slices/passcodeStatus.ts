import { createSlice } from '@reduxjs/toolkit';

export const passcodeStatusSlice = createSlice({
  name: 'passcodeStatus',
  initialState: { value: { passcode: false } },
  reducers: {
    passcodeStatusType: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { passcodeStatusType } = passcodeStatusSlice.actions;

export default passcodeStatusSlice.reducer;
