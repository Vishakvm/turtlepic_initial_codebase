import { createSlice } from '@reduxjs/toolkit';

export const customPlanSlice = createSlice({
  name: 'customPlan',
  initialState: { value: { events: 0, storage: 0 } },
  reducers: {
    customPlan: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { customPlan } = customPlanSlice.actions;

export default customPlanSlice.reducer;
