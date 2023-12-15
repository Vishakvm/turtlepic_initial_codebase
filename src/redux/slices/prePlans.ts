import { createSlice } from '@reduxjs/toolkit';

export const prePlanSlice = createSlice({
  name: 'prePlans',
  initialState: { value: { planStatus: '', planId: '' } },
  reducers: {
    prePlanDetails: (state: any, action: any) => {
      state.value = action.payload;
    },
  },
});
export const { prePlanDetails } = prePlanSlice.actions;

export default prePlanSlice.reducer;
