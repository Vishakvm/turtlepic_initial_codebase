import { createSlice } from '@reduxjs/toolkit';

export const passcodeSlice = createSlice({
  name: 'passcode',
  initialState: { value: { passcode: '' } },
  reducers: {
    passcodeType: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { passcodeType } = passcodeSlice.actions;

export default passcodeSlice.reducer;
