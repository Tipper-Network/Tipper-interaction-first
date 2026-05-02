"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import {
  loginWithCredentials,
  signupWithCredentials,
  verifyCode,
  resendVerificationCode,
  startOAuth,
} from "../api/auth_api";
import Image from "next/image";
import { useAuthStore } from "../stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  AuthFormSchema,
  VerificationCodeSchema,
  type AuthFormData,
  type VerificationCodeFormData,
} from "../types/auth_schema";
import { DullGoogleIcon } from "@/icons/links_button_icons";

type Mode = "signin" | "signup" | "verification";

interface AuthWizardProps {
  onSuccess?: () => void;
  mode?: Mode;
  returnUrl?: string;
}
export default function AuthWizard({
  onSuccess,
  mode: initialMode,
  returnUrl,
}: AuthWizardProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode ?? "signin");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [otpValue, setOtpValue] = useState("");
  // Form for signin/signup
  const authForm = useForm<AuthFormData>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form for verification code
  const verificationForm = useForm<VerificationCodeFormData>({
    resolver: zodResolver(VerificationCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  // A clean, reusable helper function
  const getOnboardingUrl = (returnUrl?: string) => {
    const base = "/users/onboarding";
    if (!returnUrl) return base;

    const params = new URLSearchParams({ returnUrl });
    return `${base}?${params.toString()}`;
  };

  async function handleSubmit(data: AuthFormData) {
    setError("");

    try {
      if (mode === "signup") {
        await signupWithCredentials(data.email, data.password);
        setEmail(data.email);
        setMode("verification");
        authForm.reset();
      } else {
        const loginResponse = await loginWithCredentials(
          data.email,
          data.password
        );

        // Check if user's email is verified
        if (loginResponse.email_verified === false) {
          // User exists but email is not verified - switch to verification mode
          setEmail(data.email);
          setMode("verification");
          authForm.reset();
          return;
        }

        // Email is verified - proceed with normal login flow
        await useAuthStore.getState().refetch();

        //new block, probably can be written better
        const user_role = useAuthStore.getState().user.user_role;
        if (user_role === "ADMIN") {
          router.push("/admin");
          onSuccess?.();
          return;
        }

        //end of it

        // Check if profile exists after login
        const profile = useAuthStore.getState().profile;
        if (!profile) {
          // No profile - redirect to onboarding to create one
          // If returnUrl contains invitationId, pass it as query param
          const onboardingUrl = getOnboardingUrl(returnUrl);
          router.push(onboardingUrl);
        } else {
          // Profile exists - redirect to returnUrl if provided, otherwise refresh
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            router.refresh();
          }
        }

        onSuccess?.();
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCodeVerification(data: VerificationCodeFormData) {
    setError("");

    try {
      const response = await verifyCode(email, data.code);

      // Use hasProfile from response to redirect immediately without calling auth/me
      if (!response.hasProfile) {
        // No profile - redirect to onboarding to create one
        // If returnUrl contains invitationId, pass it as query param
        // Don't call refetch() here - let the onboarding page handle it via RedirectHandler
        // This prevents auth/me from being called before redirect
        // Use replace to avoid adding to history stack
        const onboardingUrl = returnUrl
          ? `/users/onboarding?returnUrl=${encodeURIComponent(returnUrl)}`
          : "/users/onboarding";
        router.replace(onboardingUrl);
        // Don't call onSuccess here - let the onboarding page handle the flow
        return;
      } else {
        // Profile exists - update auth store and redirect
        await useAuthStore.getState().refetch();
        if (returnUrl) {
          router.replace(returnUrl);
        } else {
          router.replace("/explore");
        }
      }

      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function resendVerification() {
    try {
      await resendVerificationCode(email);
    } catch (err) {}
  }

  function handleOAuth(provider: string) {
    startOAuth(provider, returnUrl);
  }

  if (mode === "verification") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-tint rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="h2-bold text-foreground mb-2">Verify Email</h2>
          <p className="p-regular-16 text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <strong className="text-foreground">{email}</strong>
          </p>
        </div>

        <div className="w-full p-4 justify-center items-center flex flex-col gap-4">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(value) => setOtpValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSeparator />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSeparator />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          variant="default"
          type="button"
          onClick={() => handleCodeVerification({ code: otpValue })}
          disabled={otpValue.length !== 6}
          className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-medium-16"
        >
          Verify
        </Button>

        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={resendVerification}
            className="w-full border border-border text-foreground px-6 py-3 rounded-lg hover:bg-muted transition-colors p-medium-16"
          >
            Resend Code
          </Button>
          <Button
            variant="outline"
            onClick={() => setMode("signin")}
            className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-medium-16"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="p-medium-14 text-destructive">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="h2-bold text-foreground mb-2">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="p-regular-16 text-muted-foreground">
          {mode === "signup"
            ? "Join the Tipper community"
            : "Sign in to your account"}
        </p>
      </div>

      <FormProvider {...authForm}>
        <form
          onSubmit={authForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={authForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-lg p-medium-16 placeholder:text-muted-foreground outline-none focus:border-primary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={authForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full pl-10 pr-4 py-3 border border-border bg-background text-foreground rounded-lg p-medium-16 placeholder:text-muted-foreground outline-none focus:border-primary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="default"
            type="submit"
            disabled={authForm.formState.isSubmitting}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-medium-16"
          >
            {authForm.formState.isSubmitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </Button>
        </form>
      </FormProvider>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="p-medium-14 text-destructive">{error}</p>
        </div>
      )}

      <div className="text-center">
        <p className="p-regular-16 text-muted-foreground">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Button
            variant="ghost"
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="text-primary hover:text-primary/80 transition-colors p-medium-16"
          >
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </Button>
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground p-medium-14">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => handleOAuth("google")}
            className="flex items-center justify-center gap-2 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <DullGoogleIcon />
            <span className="p-medium-14 text-foreground">Google</span>
          </Button>
          {/* <button
            onClick={() => handleOAuth("apple")}
            className="flex items-center justify-center gap-2 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Image
              src="/brands/brandIcons/apple.png"
              alt="Apple"
              width={20}
              height={20}
            />

            <span className="p-medium-14 text-foreground">Apple</span>
          </button>
          <button
            onClick={() => handleOAuth("github")}
            className="flex items-center justify-center gap-2 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Image
              src="/brands/brandIcons/github.svg"
              alt="Github"
              width={20}
              height={20}
            />

            <span className="p-medium-14 text-foreground">GitHub</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}
