import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BackLinkProps = {
  href?: string;
  label?: string;
};

export const BackLink = ({
  href = "/",
  label = "Back",
}: BackLinkProps) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm font-medium hover:bg-gray-100"
    >
      <ArrowLeft size={18} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
