export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full rounded-full bg-gray-100 h-2">
      <div
        className="h-2 rounded-full bg-[#4D93D6]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

