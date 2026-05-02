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
      <div className="rounded-md border border-orange-200 bg-orange-50 px-3 py-2.5 text-sm text-orange-800 dark:border-orange-900/40 dark:bg-orange-500/[0.06] dark:text-orange-300">
        Password reset links expire after 30 minutes for security.
      </div>
      <div className="flex items-center justify-end">
        <Link
          href="/sign-up"
          className="text-sm font-bold text-neutral-700 transition hover:text-orange-500 dark:text-neutral-300"
        >
          Need an account?
        </Link>
      </div>
    </AuthShell>
  );
}
