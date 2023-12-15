import { createSlice } from '@reduxjs/toolkit';

export const uploadStatusSlice = createSlice({
  name: 'upload status',
  initialState: { value: { status: false, total: 0 , progress: 0 ,  success: false } },
  reducers: {
    uploadStatus: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { uploadStatus } = uploadStatusSlice.actions;
 
export default uploadStatusSlice.reducer;
