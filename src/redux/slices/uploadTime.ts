import { createSlice } from '@reduxjs/toolkit';

export const uploadTime = createSlice({
    name: 'uploadTime',
    initialState: { value: { upload_time: '' } },
    reducers: {
        uploadTimeDetails: (state: any, action: any) => {
            state.value = action.payload;
        },
    },
});
export const { uploadTimeDetails } = uploadTime.actions;

export default uploadTime.reducer;
