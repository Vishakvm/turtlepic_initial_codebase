import { createSlice } from '@reduxjs/toolkit';

export const slugSlice = createSlice({
  name: 'eventSlug',
  initialState: { value: { eventId: '', eventSlug: '', eventStatus: '', hostName: '', isProtected: false } },
  reducers: {
    eventSlugDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { eventSlugDetails } = slugSlice.actions;

export default slugSlice.reducer;
