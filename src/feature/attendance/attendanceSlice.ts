import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_WORKED_MS   = "attendance_worked_ms"
const LS_WORKED_DATE = "attendance_worked_date"

export function saveWorkedMs(ms: number) {
  try {
    localStorage.setItem(LS_WORKED_MS, String(ms))
    localStorage.setItem(LS_WORKED_DATE, new Date().toDateString())
  } catch (_) {}
}

export function loadWorkedMs(): number {
  try {
    const savedDate = localStorage.getItem(LS_WORKED_DATE)
    if (savedDate !== new Date().toDateString()) return 0
    return parseInt(localStorage.getItem(LS_WORKED_MS) ?? "0", 10) || 0
  } catch (_) {
    return 0
  }
}

export function clearWorkedMs() {
  try {
    localStorage.removeItem(LS_WORKED_MS)
    localStorage.removeItem(LS_WORKED_DATE)
  } catch (_) {}
}

// ─── State ────────────────────────────────────────────────────────────────────

interface AttendanceState {
  isCheckedIn:   boolean
  checkInTime:   number | null
  attendanceId:  number | null
  totalWorkedMs: number
}

const initialState: AttendanceState = {
  isCheckedIn:   false,
  checkInTime:   null,
  attendanceId:  null,
  totalWorkedMs: 0,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {

    setCheckIn(state, action: PayloadAction<{ time: number; id?: number }>) {
      state.isCheckedIn  = true
      state.checkInTime  = action.payload.time
      state.attendanceId = action.payload.id || null
    },

    setCheckOut(state, action: PayloadAction<{ sessionMs: number }>) {
      const newTotal = (state.totalWorkedMs ?? 0) + (action.payload.sessionMs ?? 0)
      state.isCheckedIn   = false
      state.checkInTime   = null
      state.attendanceId  = null
      state.totalWorkedMs = newTotal
      // ✅ NO localStorage here — pure reducer
    },

    resetAttendance(state) {
      state.isCheckedIn   = false
      state.checkInTime   = null
      state.attendanceId  = null
      state.totalWorkedMs = 0
      // ✅ NO localStorage here — pure reducer
    },

    hydrateAttendance(
      state,
      action: PayloadAction<{ is_checked_in: boolean; check_in: string; attendance_id: number; restoredWorkedMs?: number }>
    ) {
      if (action.payload?.is_checked_in) {
        state.isCheckedIn   = true
        state.checkInTime   = new Date(action.payload.check_in).getTime()
        state.attendanceId  = action.payload.attendance_id || null
        state.totalWorkedMs = action.payload.restoredWorkedMs ?? 0
      } else {
        state.isCheckedIn  = false
        state.checkInTime  = null
        state.attendanceId = null
      }
    },
  },
})

export const { setCheckIn, setCheckOut, hydrateAttendance, resetAttendance } =
  attendanceSlice.actions

export default attendanceSlice.reducer