type Props = {
  score?: number | null;
  label?: string | null;
};

export function ScoreCard({ score, label }: Props) {
  const normalized = typeof score === "number" ? Math.max(0, Math.min(100, score)) : null;
  return (
    <div className="card p-5 space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs uppercase tracking-wide text-gray-500">Operational Score</p>
        {normalized !== null ? (
          <div className="text-3xl font-bold text-[#FE5E17]">{normalized}</div>
        ) : (
          <div className="text-sm text-gray-500">No score yet</div>
        )}
        {label ? <p className="text-sm text-gray-700">{label}</p> : null}
      </div>
      {normalized !== null ? (
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-[#93D753]"
              style={{ width: `${normalized}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Profile generated with COTIT 360° Operational Intelligence.
          </p>
        </div>
      ) : null}
    </div>
  );
}

