import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { value: { type: '', guest: false, client: false, teamMember: false } },
  reducers: {
    authType: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { authType } = authSlice.actions;

export default authSlice.reducer;
