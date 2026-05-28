import Image from "next/image";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/brand/logo.png" alt="Lebenslauf logo" width={44} height={44} className="h-11 w-11 rounded" priority />
      <span className="font-heading text-xl font-extrabold text-brand-navy">Lebenslauf</span>
    </div>
  );
}
