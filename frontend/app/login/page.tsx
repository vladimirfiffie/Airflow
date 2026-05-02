import AuthShell from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      mode="login"
      title="Welcome back"
      subtitle="Sign in to manage bookings, check schedules, and track your upcoming flights."
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerLinkHref="/sign-up"
    />
  );
}
