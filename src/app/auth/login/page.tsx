"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeClosed, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"

import api from "@/lib/axios"
import { useAppDispatch } from "@/lib/hooks"
import { useRouter } from "next/navigation" 
import { setCredentials } from "@/feature/auth/authslice"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const dispatch = useAppDispatch()
  const router = useRouter()

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)

  try {
    const res = await api.post("/auth/login", { email, password })
    const { user } = res.data.data
    const loginTime = Date.now()

    localStorage.setItem("loginTime", loginTime.toString())

    dispatch(
      setCredentials({
        user: { ...user, loginTime },
      })
    )

    switch (user.role) {
      case "admin":
        router.push("/dashboard/admin")
        break

      case "hr":
        router.push("/dashboard/humanresources")
        break

      case "founder":
        router.push("/dashboard/founder")
        break

      default:
        router.push("/dashboard/employee")
    }
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
        "Authentication failed. Please check your credentials."
    )
  } finally {
    setIsLoading(false)
  }
};

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#ACC8A2]/70 overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200 blur-[120px]" />
      </div>
      <Card className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm border border-[#1A2517]/10 shadow-[0_35px_60px_-15px_rgba(26,37,23,0.3)]">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-[#1A2517]/10 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-[#1A2517]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-[#1A2517]">Bheema Infotech</CardTitle>
          <CardDescription>
            Enter your employee credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} noValidate className="space-y-4">
            {error && (
              <div className="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in duration-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-slate-700">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="name@company.com"
                  className="pl-10 h-11 focus-visible:ring-[#1A2517]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" title="password" className="font-semibold text-slate-700">Password</Label>
                <a href="#" className="text-xs text-[#1A2517] hover:underline font-bold">
                  Forgot password?
                </a>
              </div>
             <div className="relative">
  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

  <Input 
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    className="pl-10 pr-10 h-11 focus-visible:ring-[#1A2517]"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-2.5 text-slate-400 hover:text-[#1A2517]"
  >
    {showPassword ? <Eye /> : <EyeClosed />}
  </button>
</div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 font-bold bg-[#1A2517] hover:bg-[#2a3b26] shadow-xl shadow-[#1A2517]/20 transition-all active:scale-[0.98]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-xl">
          <p className="text-[10px] uppercase tracking-widest text-center text-slate-400 font-bold">
            Authorized Personnel Only
          </p>
          <p className="text-xs text-center text-slate-500 mt-2">
            By logging in, you agree to our 
            <a href="#" className="underline ml-1 hover:text-[#1A2517]">Security Policy</a>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}