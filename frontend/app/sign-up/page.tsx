import Link from "next/link";
import AuthShell, { AuthField } from "@/components/auth/auth-shell";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your workspace to centralize passenger bookings, schedules, and support workflows."
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerLinkHref="/login"
    >
      <AuthField label="Work Email" type="email" name="email" placeholder="name@company.com" />
      <AuthField label="Full Name" type="text" name="name" placeholder="Jane Doe" />
      <AuthField label="Password" type="password" name="password" placeholder="Create a secure password" />
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <span>By continuing, you agree to our terms.</span>
        <Link href="/help" className="font-semibold text-slate-700 hover:underline dark:text-slate-200">
          View policy
        </Link>
      </div>
    </AuthShell>
  );
}
