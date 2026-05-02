import AuthShell from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      mode="forgot"
      title="Reset your password"
      subtitle="Enter the email associated with your account and we'll send a secure reset link."
      footerText="Remembered your password?"
      footerLinkLabel="Log in"
      footerLinkHref="/login"
    />
  );
}
