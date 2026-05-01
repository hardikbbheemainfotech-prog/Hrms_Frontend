import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  loginTime: number | null; 
  duration: number;        
}

const initialState: SessionState = {
  loginTime: null,
  duration: 0,
};

const employeeSessionSlice = createSlice({
  name: "employeeSession",
  initialState,
  reducers: {
    setLoginTime(state, action: PayloadAction<number>) {
      state.loginTime = action.payload;
    },

    updateDuration(state) {
      if (state.loginTime) {
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