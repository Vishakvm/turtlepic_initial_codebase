import { createSlice } from '@reduxjs/toolkit';

export const selfieSlice = createSlice({
  name: 'selfie',
  initialState: { value: { has_selfie: false } },
  reducers: {
    selfieType: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { selfieType } = selfieSlice.actions;

export default selfieSlice.reducer;
