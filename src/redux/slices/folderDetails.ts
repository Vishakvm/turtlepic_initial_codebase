import { createSlice } from '@reduxjs/toolkit';

export const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    value: {
      id: '',
      name: '',
      allow_download: false,
      skip_duplicates: false,
      photo_count: 0,
      video_count: 0,
      is_default: false,
      date: '',
      cover_picture: '' || null    
    },
  },
  reducers: {
    folderDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { folderDetails } = folderSlice.actions;

export default folderSlice.reducer;
