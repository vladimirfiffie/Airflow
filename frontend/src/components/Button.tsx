import { Button as ShadcnButton } from "@/components/ui/button";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button({
  variant = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variant}
      className={className}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
}
