import { DecayRisk } from "@/types";

interface DecayBadgeProps {
  risk: DecayRisk;
  compact?: boolean;
}

const config: Record<DecayRisk, { label: string; bg: string; text: string }> = {
  high: {
    label: "High Decay Risk",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
  },
  medium: {
    label: "Medium Risk",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  stable: {
    label: "Stable",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
  },
};

export default function DecayBadge({ risk, compact = false }: DecayBadgeProps) {
  const c = config[risk];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}
    >
      {risk === "high" && "🔴 "}
      {risk === "medium" && "🟡 "}
      {risk === "stable" && "🟢 "}
      {compact
        ? risk.charAt(0).toUpperCase() + risk.slice(1)
        : c.label}
    </span>
  );
}
