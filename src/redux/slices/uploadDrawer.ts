import { createSlice } from '@reduxjs/toolkit';

export const uploadStatusDrawerSlice = createSlice({
  name: 'upload status drawer',
  initialState: { value: { status: false, total: 0 , progress: 0 ,  success: false } },
  reducers: {
    uploadStatusDrawer: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { uploadStatusDrawer } = uploadStatusDrawerSlice.actions;
 
export default uploadStatusDrawerSlice.reducer;
