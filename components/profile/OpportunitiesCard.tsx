type Props = {
  title: string;
  items?: string[] | null;
};

export function OpportunitiesCard({ title, items }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <div className="card p-5 space-y-3">
      <h3 className="text-lg font-semibold font-heading">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-[#4D93D6]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

