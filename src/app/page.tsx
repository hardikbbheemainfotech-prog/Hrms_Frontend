"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import WelcomeLoader from "@/components/ui/welcomeloader"


export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  return (
    <>
      {loading && (
        <WelcomeLoader
          onFinish={() => {
            setLoading(false)
            router.push("/auth/login")
          }}
        />
      )}
    </>
  )
}