import Link from "next/link";
import AuthShell, { AuthField } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue managing bookings, checking schedules, and tracking your upcoming flights."
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerLinkHref="/sign-up"
    >
      <AuthField label="Email" type="email" name="email" placeholder="name@company.com" />
      <AuthField label="Password" type="password" name="password" placeholder="Enter your password" />
      <div className="flex items-center justify-end">
        <Link href="/forgot-password" className="text-sm font-semibold text-slate-700 hover:underline dark:text-slate-200">
          Forgot password?
        </Link>
      </div>
    </AuthShell>
  );
}
