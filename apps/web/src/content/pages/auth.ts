export const AUTH = {
  signIn: {
    title: "Welcome Back",
    subtitle: "Sign in to your account",
    submit: "Sign In",
    toggle: "Don't have an account?",
    toggleAction: "Sign Up",
  },
  signUp: {
    title: "Create Account",
    subtitle: "Join the Tipper community",
    submit: "Create Account",
    toggle: "Already have an account?",
    toggleAction: "Sign In",
  },
  verify: {
    title: "Verify Email",
    instruction: "Enter the 6-digit code sent to",
    submit: "Verify",
    resend: "Resend Code",
    back: "Back to Login",
  },
  shared: {
    emailPlaceholder: "Email address",
    passwordPlaceholder: "Password",
    loading: "Please wait...",
    oauthDivider: "Or continue with",
    google: "Google",
  },
} as const;
