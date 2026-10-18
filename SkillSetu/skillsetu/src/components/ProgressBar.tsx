interface ProgressBarProps {
  value: number;
  max: number;
}

export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-zinc-800">
      <div 
        className="bg-blue-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
