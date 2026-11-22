import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  href?: string;
  size?: number;
  showText?: boolean;
  className?: string;
  isLightText?: boolean;
}

export default function BrandLogo({
  href = "/",
  size = 40,
  showText = true,
  className = "",
  isLightText = false,
}: BrandLogoProps) {
  const content = (
    <div className={`d-inline-flex align-items-center gap-2 text-decoration-none ${className}`}>
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo.png"
          alt="KasKos Logo"
          width={size}
          height={size}
          className="object-fit-contain"
          priority
          quality={100}
        />
      </div>

      {showText && (
        <span className="brand-logo-text user-select-none">
          <span className={isLightText ? "text-white" : "kas-part"}>Kas</span>
          <span className="kos-part">Kos</span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="text-decoration-none d-inline-flex">
      {content}
    </Link>
  );
}
