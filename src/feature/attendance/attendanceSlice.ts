import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AttendanceState {
  isCheckedIn: boolean
  checkInTime: number | null
  attendanceId: number | null
  totalWorkedMs: number
}

const initialState: AttendanceState = {
  isCheckedIn: false,
  checkInTime: null,
  attendanceId: null,
  totalWorkedMs: 0,
}

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setCheckIn(state, action: PayloadAction<{ time: number; id?: number }>) {
      state.isCheckedIn = true
      state.checkInTime = action.payload.time
      state.attendanceId = action.payload.id || null
    },
    setCheckOut(state, action: PayloadAction<{ sessionMs: number }>) {
      state.isCheckedIn = false
      state.totalWorkedMs = (state.totalWorkedMs ?? 0) + action.payload.sessionMs
      state.checkInTime = null
      state.attendanceId = null
    },

    resetAttendance(state) {
      state.isCheckedIn = false
      state.checkInTime = null
      state.attendanceId = null
      state.totalWorkedMs = 0
    },

    hydrateAttendance(state, action: PayloadAction<any>) {
      if (action.payload?.is_checked_in) {
        state.isCheckedIn = true
        state.checkInTime = new Date(action.payload.check_in).getTime()
        state.attendanceId = action.payload.attendance_id || null
      } else {
        state.isCheckedIn = false
        state.checkInTime = null
        state.attendanceId = null
      }
    },
  },
})

export const { setCheckIn, setCheckOut, hydrateAttendance, resetAttendance } =
  attendanceSlice.actions

export default attendanceSlice.reducer