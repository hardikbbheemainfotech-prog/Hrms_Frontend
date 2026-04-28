import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = 'admin' | 'hr' | 'employee' | 'founder';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  profile_url?: string;
  profile_image?: string; 
  department?: string;
  loginTime?: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   setCredentials: (state, action: PayloadAction<{ user: any }>) => {
  const newUser = action.payload.user;
  state.user = {
    ...state.user,
    ...newUser,    
    profile_image: newUser.profile_image || state.user?.profile_image,
    loginTime: newUser.login_time ? new Date(newUser.login_time).getTime() : (state.user?.loginTime || Date.now())
  };

  state.isAuthenticated = true;
  state.isInitialized = true;
  state.loading = false;
},
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.loading = false;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, logout, setInitialized, setLoading } = authSlice.actions;
export default authSlice.reducer;