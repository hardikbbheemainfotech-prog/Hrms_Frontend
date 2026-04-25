"use client"

import { useState, useEffect, use } from "react"

const CRIMSON = "#1A2517"
const CREAM = "#ACC8A2"

type Props = {
  onFinish?: () => void
}

export default function WelcomeLoader({ onFinish }: Props) {
  const [show, setShow] = useState(false)
  const [barW, setBarW] = useState(0)
  useEffect(() => {
    const showTimeout = setTimeout(() => setShow(true), 80)
    const barTimeout = setTimeout(() => setBarW(100), 220)
      const finishTimeout = setTimeout(() => {
        setShow(false)
        setTimeout(() => {
          onFinish?.()
        }, 450)
    }, 2100)

    return () => {
      clearTimeout(showTimeout)
      clearTimeout(barTimeout)
      clearTimeout(finishTimeout)
    }
  }, [onFinish])

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
        {/* Logo */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            background: CRIMSON,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 800,
            color: CREAM,
            boxShadow: "0 0 30px #1A2517",
            marginBottom: 4,
          }}
        >
          B
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: CRIMSON,
            letterSpacing: "0.03em",
          }}
        >
          Bheema InfoTech
        </div>


        {/* Progress Bar */}
        <div
          style={{
            marginTop: 20,
            width: 150,
            height: 2,
            background: "rgba(139,0,74,0.18)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              background: `linear-gradient(90deg, ${CRIMSON}, ${CRIMSON}AA)`,
              width: `${barW}%`,
              transition:
                "width 1.65s cubic-bezier(.4,0,.2,1) 0.1s",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 10,
            color: "#1A2517",
            letterSpacing: "0.15em",
            marginTop: 5,
          }}
        >
          INITIALIZING...
        </div>
      </div>
    </div>
  )
}