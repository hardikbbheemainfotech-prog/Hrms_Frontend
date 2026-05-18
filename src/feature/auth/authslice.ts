import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type UserRole = "admin" | "hr" | "employee" | "founder"

interface UserProfile {
  id: string
  user_id?: number         // Refresh API se aata hai
  employee_id?: number | string // Attendance ke liye zaroori hai
  first_name?: string
  last_name?: string
  name?: string
  email: string
  role: UserRole
  avatar?: string
  profile_url?: string
  profile_image?: string
  department?: string
  loginTime?: number
  loginDate?: string
}

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isInitialized: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any }>) => {
      const newUser = action.payload.user

      // Parse backend login timestamp
      const parsedLoginTime = newUser.login_time
        ? new Date(newUser.login_time).getTime()
        : null

      state.user = {
        // Step 1: Purana state merge karo
        ...state.user,
        
        // Step 2: Naya data merge karo (employee_id isi ke andar aa jayega agar backend bhej raha hai)
        ...newUser,

        // Step 3: Explicit mapping (Safety ke liye)
        id: newUser.id || newUser.user_id || state.user?.id,
        user_id: newUser.user_id || state.user?.user_id,
        
        // Ensure employee_id hamesha state mein save ho
        employee_id: newUser.employee_id || state.user?.employee_id,

        profile_image:
          newUser.profile_image ||
          newUser.profile_url ||
          state.user?.profile_image,

        // Preserve original login time across refreshes
        loginTime:
          state.user?.loginTime ||
          parsedLoginTime ||
          Date.now(),

        // Preserve original login date
        loginDate:
          state.user?.loginDate ||
          (parsedLoginTime
            ? new Date(parsedLoginTime).toDateString()
            : new Date().toDateString()),
      }

      state.isAuthenticated = true
      state.isInitialized = true
      state.loading = false
    },

    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isInitialized = true
      state.loading = false
    },

    setInitialized: (state) => {
      state.isInitialized = true
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const {
  setCredentials,
  logout,
  setInitialized,
  setLoading,
} = authSlice.actions

export default authSlice.reducer