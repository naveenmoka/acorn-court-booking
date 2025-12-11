import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch initial data
export const fetchResources = createAsyncThunk(
  "booking/fetchResources",
  async () => {
    const courtsRes = await axios.get("http://localhost:5000/api/courts");
    const coachesRes = await axios.get("http://localhost:5000/api/coaches");
    return { courts: courtsRes.data, coaches: coachesRes.data };
  }
);

const initialState = {
  courts: [],
  coaches: [],
  existingBookings: [],

  // The User's Selection
  selectedDate: new Date().toISOString(),
  selectedCourt: null,
  selectedSlot: null,

  status: "idle",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
      state.selectedSlot = null;
    },
    setSelectedCourt: (state, action) => {
      state.selectedCourt = action.payload;
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    toggleCoach: (state, action) => {
      // If clicking the same coach, deselect. Else select new.
      if (state.selectedCoach?._id === action.payload._id) {
        state.selectedCoach = null;
      } else {
        state.selectedCoach = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      state.courts = action.payload.courts;
      state.coaches = action.payload.coaches;
      state.status = "succeeded";
    });
  },
});

export const {
  setSelectedDate,
  setSelectedCourt,
  setSelectedSlot,
  toggleCoach,
} = bookingSlice.actions;
export default bookingSlice.reducer;
