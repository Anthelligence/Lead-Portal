 "use client";

type Props = {
  url: string;
};

export function ShareBar({ url }: Props) {
  const encoded = encodeURIComponent(url);
  return (
    <div className="card p-4 space-y-3 text-center">
      <p className="text-sm font-semibold">Share this profile</p>
      <div className="flex items-center justify-center gap-3">
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encoded}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[#FE5E17]/10 px-3 py-2 text-xs font-semibold text-[#FE5E17]"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:?subject=COTIT%20Profile&body=${encoded}`}
          className="rounded-full bg-[#FE5E17]/10 px-3 py-2 text-xs font-semibold text-[#FE5E17]"
        >
          Email
        </a>
        <button
          onClick={() => navigator.clipboard.writeText(url)}
          className="rounded-full bg-[#FE5E17]/10 px-3 py-2 text-xs font-semibold text-[#FE5E17]"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}

