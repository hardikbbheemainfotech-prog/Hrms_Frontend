import axios from "axios";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const api = axios.create({
  baseURL: "/api", 
  withCredentials: true,
});




api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// axios.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚩 CHECK: Agar request logout ki hai, toh REFRESH ya REDIRECT mat karo
    // Seedha error wapas bhejo taaki useLogout handle kare
    if (originalRequest.url?.includes("/auth/logout")) {
      return Promise.reject(error); 
    }

    // Baaki requests ke liye refresh logic (jaisa pehle tha)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.get("/api/auth/refresh", { withCredentials: true });
        return api(originalRequest);
      } catch (err) {
        // Refresh fail ho toh login bhejo
        window.location.href = "/auth/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;