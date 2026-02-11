"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Logo } from "@/components/ui";
import GrowingDotsBackground from '@/components/ui/GrowingDotsBackground'
import { Eye, EyeSlash, Lock1, User } from "iconsax-reactjs";
import { useAdminLogin } from "@/hooks/useAuth";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isPending, error } = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ adminId, password });
      router.push("/admin/dashboard");
    } catch {
      // Error handled by mutation state
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
      <GrowingDotsBackground />
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1">

              <Logo size="lg" />

            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-neutral-900 mb-8">
            Log In
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID Field */}
            <Input
              label="Admin ID"
              type="text"
              id="adminId"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Your ID"
              leftIcon={
                <User size={20} className="text-neutral-400" />
              }
              required
            />

            {/* Password Field */}
            <div className="space-y-2">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={
                  <Lock1 size={20} className="text-neutral-400" />
                }
                rightIcon={
                  showPassword ? (
                    <EyeSlash size={20} className="text-neutral-400" />
                  ) : (
                    <Eye size={20} className="text-neutral-400" />
                  )
                }
                onRightIconClick={() => setShowPassword(!showPassword)}
                required
              />

              {/* Forgot Password Link */}
              <a href="#" className="inline-block text-sm text-neutral-500 hover:text-primary transition-colors mt-1">
                Forgot Password?
              </a>
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {(error as any)?.response?.data?.message || (error as Error).message || "Failed to sign in. Please try again."}
              </p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="solid"
              size="md"
              fullWidth
              isLoading={isPending}
              className="mt-4 rounded-xl"
            >
              Log in
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
