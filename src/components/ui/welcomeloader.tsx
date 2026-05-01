"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setCredentials, setInitialized } from "@/feature/auth/authslice"
import api from "@/lib/axios"

const CRIMSON = "#1A2517"
const CREAM = "#ACC8A2"

type Props = {
  onFinish?: () => void
}





export default function WelcomeLoader({ onFinish }: Props) {
  const [show, setShow] = useState(false)
  const [barW, setBarW] = useState(0)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const showTimeout = setTimeout(() => setShow(true), 80)
    const barTimeout = setTimeout(() => setBarW(100), 220)

const checkAuthAndFinish = async () => {
  try {
    const today = new Date().toDateString()

    const storedAuth = localStorage.getItem("persist:root")

    if (storedAuth) {
      const parsedRoot = JSON.parse(storedAuth)
      const authData = parsedRoot.auth ? JSON.parse(parsedRoot.auth) : null

      const loginDate = authData?.user?.loginDate

      if (!loginDate || loginDate !== today) {
        localStorage.removeItem("persist:root")

        dispatch(setInitialized())

        setShow(false)

        setTimeout(() => {
          onFinish?.()
        }, 450)

        return
      }
    }

    const res = await api.get("/auth/refresh")

    if (res.data.success) {
      const userData = res.data.data.user;
      let userRole = userData.role; 
      dispatch(setCredentials({ user: userData }));
      dispatch(setInitialized());

      setTimeout(() => {
        setShow(false)

        setTimeout(() => {
          if (userRole === "employee") {
            router.replace(`/dashboard/employee`)
          } else if (userRole === "hr") {
            router.replace(`/dashboard/humanresources/Home`)
          }else if (userRole === "admin") {
            router.replace(`/dashboard/admin`)
          }else {
            router.replace("/auth/login")
          }
        }, 450)
      }, 1500)

      return
    }
  } catch (err) {
    console.log("Session dead, stay on login")

    dispatch(setInitialized())

    setTimeout(() => {
      setShow(false)

      setTimeout(() => {
        onFinish?.()
      }, 450)
    }, 1000)
  }
}
    checkAuthAndFinish();

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(barTimeout);
    };
  }, [onFinish, dispatch, router]);


  

  return (
    <div style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.88)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 60, height: 60, borderRadius: 14, background: CRIMSON,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, fontWeight: 800, color: CREAM,
            boxShadow: "0 10px 30px rgba(26,37,23,0.3)", marginBottom: 4,
          }}
        >
          B
        </div>

        <div style={{ fontSize: 24, fontWeight: 700, color: CRIMSON, letterSpacing: "0.03em" }}>
          Bheema InfoTech
        </div>

        <div style={{ marginTop: 20, width: 150, height: 2, background: "rgba(26,37,23,0.1)", borderRadius: 4, overflow: "hidden" }}>
          <div
            style={{
              height: "100%", borderRadius: 4,
              background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON}AA)`,
              width: `${barW}%`, transition: "width 1.6s cubic-bezier(.4,0,.2,1) 0.1s",
            }}
          />
        </div>

        <div style={{ fontSize: 10, color: CRIMSON, letterSpacing: "0.15em", marginTop: 5, fontWeight: 600 }}>
          SYNCHRONIZING SESSION...
        </div>
      </div>
    </div>
  )
}