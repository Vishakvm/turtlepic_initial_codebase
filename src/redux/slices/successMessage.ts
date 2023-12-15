import { createSlice } from '@reduxjs/toolkit';

export const successSlice = createSlice({
  name: 'success',
  initialState: { value: { message: '' } },
  reducers: {
    successMessage: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { successMessage } = successSlice.actions;

export default successSlice.reducer;
