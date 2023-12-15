import { createSlice } from '@reduxjs/toolkit';

export const eventDetailSlice = createSlice({
  name: 'createEvent',
  initialState: {
    value: {
      id: '',
      venue: '',
      date: '',
      name: '',
      event_status: '',
      eventType: '',
      client_name: '',
      client_email: '',
      client_status: '',
      slug: '',
      is_event_list: false,
      host_name: '',
      upload_time_left:'',
      upload_time_percent:''
    },
  },
  reducers: {
    eventDetails: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { eventDetails } = eventDetailSlice.actions;

export default eventDetailSlice.reducer;
