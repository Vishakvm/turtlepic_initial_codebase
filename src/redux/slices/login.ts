import { createSlice } from '@reduxjs/toolkit';

export const loginSlice = createSlice({
  name: 'login',
  initialState: { value: { name: '', email: '' } },
  reducers: {
    userDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { userDetails } = loginSlice.actions;

export default loginSlice.reducer;
