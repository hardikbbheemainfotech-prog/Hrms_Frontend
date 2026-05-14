"use client"

import { useState } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use-toast"
import { useSelector } from "react-redux"
import { Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type RootState = {
  auth: {
    user: {
      email: string
    } | null
  }
}

export default function ResetPasswordPage() {
  const { toast } = useToast()

  const currentUser = useSelector((state: RootState) => state.auth.user)

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const togglePasswordVisibility = (
    field: "old" | "new" | "confirm"
  ) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser?.email) {
      toast({
        title: "User not found",
        description: "Unable to verify account session.",
        variant: "destructive",
      })
      return
    }

    if (
      !formData.old_password ||
      !formData.new_password ||
      !formData.confirmPassword
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.new_password.length < 8) {
      toast({
        title: "Weak password",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (formData.new_password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      await api.post("/auth/change_password", {
        email: currentUser.email,
        old_password: formData.old_password,
        new_password: formData.new_password,
      })

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })

      setFormData({
        old_password: "",
        new_password: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Reset failed",
        description:
          error?.response?.data?.message ||
          "Old password may be incorrect.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1E9E4]/60 p-6">
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-0 bg-white/90 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-full bg-[#5A0F2E]/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-[#5A0F2E]" />
          </div>

          <CardTitle className="text-2xl font-bold text-[#5A0F2E]">
            Reset Password
          </CardTitle>

          <CardDescription>
            Change your password securely using your current credentials
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* OLD PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Old Password
              </label>

              <div className="relative">
                <Input
                  type={showPasswords.old ? "text" : "password"}
                  name="old_password"
                  value={formData.old_password}
                  onChange={handleChange}
                  placeholder="Enter old password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("old")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.old ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                New Password
              </label>

              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("new")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.new ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm New Password
              </label>

              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    togglePasswordVisibility("confirm")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.old_password ||
                !formData.new_password ||
                !formData.confirmPassword
              }
              className="w-full bg-[#5A0F2E] hover:bg-[#4A0D26]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}