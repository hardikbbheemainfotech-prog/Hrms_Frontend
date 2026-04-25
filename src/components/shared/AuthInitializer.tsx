"use client"

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials, setInitialized } from "@/feature/auth/authslice";
import api from "@/lib/axios";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/refresh"); 
        dispatch(setCredentials({ user: res.data.data.user }));
      } catch (error) {
        console.log("No valid session found during initialization");
      } finally {
        dispatch(setInitialized());
      }
    };

    checkSession();
  }, [dispatch]);

  return <>{children}</>;
}