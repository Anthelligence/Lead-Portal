import { Button } from "@/components/ui/Button";

type Props = {
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  whatsapp?: string | null;
  messaging?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  x?: string | null;
  vcardUrl?: string;
};

export function ContactCard({
  phone,
  email,
  website,
  whatsapp,
  messaging,
  linkedin,
  instagram,
  tiktok,
  x,
  vcardUrl
}: Props) {
  const items = [
    { label: "Call", href: phone ? `tel:${phone}` : null, key: "call" },
    { label: "Email", href: email ? `mailto:${email}` : null, key: "email" },
    { label: "Website", href: website ?? null, key: "web" },
    {
      label: "Messaging",
      href: messaging ?? (whatsapp ? `https://wa.me/${whatsapp}` : null),
      key: "msg"
    },
    { label: "LinkedIn", href: linkedin ?? null, key: "in" },
    { label: "Instagram", href: instagram ?? null, key: "ig" },
    { label: "TikTok", href: tiktok ?? null, key: "tt" },
    { label: "X", href: x ?? null, key: "x" }
  ].filter((i) => i.href);

  const iconStyles: Record<
    string,
    { bg: string; fg: string; glyph: string }
  > = {
    call: { bg: "bg-[#e6f3ff]", fg: "text-[#1d6ae5]", glyph: "☎" },
    email: { bg: "bg-[#fff2e6]", fg: "text-[#fe5e17]", glyph: "✉" },
    web: { bg: "bg-[#f1f5f9]", fg: "text-[#0f172a]", glyph: "⛓" },
    msg: { bg: "bg-[#e6fff3]", fg: "text-[#169c52]", glyph: "💬" },
    in: { bg: "bg-[#e8f4ff]", fg: "text-[#0a66c2]", glyph: "in" },
    ig: { bg: "bg-gradient-to-br from-[#ff9a9e]/30 via-[#fad0c4]/40 to-[#fad0c4]/60", fg: "text-[#d62976]", glyph: "ig" },
    tt: { bg: "bg-[#000]/5", fg: "text-[#000]", glyph: "tt" },
    x: { bg: "bg-[#000]/5", fg: "text-[#111]", glyph: "x" }
  };

  function renderIcon(key: string) {
    const style = iconStyles[key] || { bg: "bg-gray-100", fg: "text-gray-700", glyph: "·" };
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${style.bg} ${style.fg}`}
        aria-hidden
      >
        {style.glyph}
      </span>
    );
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href!}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold hover:border-[#FE5E17] hover:text-[#FE5E17] bg-white"
            target="_blank"
            rel="noreferrer"
          >
            {renderIcon(item.key)}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
      {vcardUrl ? (
        <a
          href={vcardUrl}
          className="inline-flex w-full items-center justify-center rounded-full border border-[#FE5E17] px-4 py-3 text-sm font-semibold text-[#FE5E17] hover:bg-[#fff3ec]"
          download
        >
          Download vCard
        </a>
      ) : null}
    </div>
  );
}

