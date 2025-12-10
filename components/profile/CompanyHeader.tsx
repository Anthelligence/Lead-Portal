import Image from "next/image";

type Props = {
  name: string;
  businessType?: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  readinessLabel?: string | null;
};

export function CompanyHeader({
  name,
  businessType,
  bannerUrl,
  logoUrl,
  readinessLabel
}: Props) {
  const readinessText = readinessLabel
    ? readinessLabel.includes("Operational Readiness Level")
      ? readinessLabel
      : `Operational Readiness Level: ${readinessLabel}`
    : null;

  return (
    <div className="relative">
      <div className="h-40 w-full overflow-hidden rounded-2xl bg-gray-100">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt={`${name} banner`}
            width={1200}
            height={320}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-[#FE5E17]/80 to-[#4D93D6]/70" />
        )}
      </div>
      <div className="absolute left-1/2 top-28 -translate-x-1/2">
        <div className="h-24 w-24 rounded-full border-4 border-white shadow-soft overflow-hidden bg-white">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              width={120}
              height={120}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-white text-lg font-semibold">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      <div className="pt-16 text-center space-y-2">
        <h1 className="text-2xl font-semibold font-heading">{name}</h1>
        {businessType ? <p className="text-sm text-gray-600">{businessType}</p> : null}
        {readinessText ? (
          <div className="inline-flex rounded-full bg-[#FE5E17]/10 px-4 py-2 text-xs font-semibold text-[#FE5E17]">
            {readinessText}
          </div>
        ) : null}
      </div>
    </div>
  );
}

