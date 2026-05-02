import AuthShell from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      mode="signup"
      title="Create your account"
      subtitle="Set up your workspace to centralize bookings, schedules, and support workflows."
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerLinkHref="/login"
    />
  );
}
