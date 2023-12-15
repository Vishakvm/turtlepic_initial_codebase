import { createSlice } from '@reduxjs/toolkit';

export const userTypeSlice = createSlice({
  name: 'usertype',
  initialState: { value: { type: '' } },
  reducers: {
    selectType: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { selectType } = userTypeSlice.actions;

export default userTypeSlice.reducer;
