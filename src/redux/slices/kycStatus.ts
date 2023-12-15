import { createSlice } from '@reduxjs/toolkit';

export const kycStatusSlice = createSlice({
  name: 'kycStatus',
  initialState: { value: { kyc_status: '' } },
  reducers: {
    kycStatusDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { kycStatusDetails } = kycStatusSlice.actions;

export default kycStatusSlice.reducer;
