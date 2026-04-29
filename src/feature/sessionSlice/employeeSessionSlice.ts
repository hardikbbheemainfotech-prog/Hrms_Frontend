import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  loginTime: number | null; // Shift start time (Timestamp)
  duration: number;        // Elapsed time in ms
}

const initialState: SessionState = {
  loginTime: null,
  duration: 0,
};

const employeeSessionSlice = createSlice({
  name: "employeeSession",
  initialState,
  reducers: {
    // 1. Jab user Punch-in kare tab ye call karo
    setLoginTime(state, action: PayloadAction<number>) {
      state.loginTime = action.payload;
    },

    // 2. Refresh-safe Update Logic
    updateDuration(state) {
      if (state.loginTime) {
        // Calculation: Current Time - Start Time
        // Isse farak nahi padta ki kitni baar refresh ho, calculation hamesha sahi aayegi
        state.duration = Date.now() - state.loginTime;
      }
    },

    resetSession(state) {
      state.loginTime = null;
      state.duration = 0;
    },
  },
});

export const { setLoginTime, updateDuration, resetSession } = employeeSessionSlice.actions;
export default employeeSessionSlice.reducer;