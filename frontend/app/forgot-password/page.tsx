import Link from "next/link";
import AuthShell, { AuthField } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email associated with your account and we will send a secure reset link."
      footerText="Remembered your password?"
      footerLinkLabel="Log in"
      footerLinkHref="/login"
    >
      <AuthField label="Email" type="email" name="email" placeholder="name@company.com" />
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Password reset links expire after 30 minutes for security.
      </div>
      <div className="flex items-center justify-end">
        <Link href="/sign-up" className="text-sm font-semibold text-slate-700 hover:underline dark:text-slate-200">
          Need an account?
        </Link>
      </div>
    </AuthShell>
  );
}
