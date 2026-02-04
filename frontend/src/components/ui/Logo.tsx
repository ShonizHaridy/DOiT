// components/ui/Logo.tsx
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
}

const sizeMap = {
  sm: { width: 145, height: 50 },   // smallest variant
  md: { width: 149, height: 51 },   // mobile/some pages
  lg: { width: 201, height: 69 },   // desktop/some pages
  xl: { width: 264, height: 91 },   // largest variant
};

export default function Logo({ size = "lg", href, className = "" }: LogoProps) {
  const { width, height } = sizeMap[size];
  
  const logoImage = (
    <Image
      src="/logo.svg"
      alt="DOiT Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}