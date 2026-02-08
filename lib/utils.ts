import { ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { Flag } from "./types";

export const colorFlag = (flag: Flag) => {
	switch (flag) {
		case "gap_estimated":
      return "#f59e0b"; // amber
    case "counter_reset":
      return "#ef4444"; // red
    default:
      return "#3b82f6"; // blue
	}
};

export const safeNumber = (n: number): number => {
  return Number.isFinite(n) ? n : 0;
}

export const formatTooltipValue = (value: ValueType): string => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toFixed(2) : "N/A";
  }

  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n.toFixed(2) : "N/A";
  }

  // value puede ser Array<number|string>
  const parts = value.map((v: number | string) => {
    if (typeof v === "number") return Number.isFinite(v) ? v.toFixed(2) : "N/A";
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : "N/A";
  });

  return parts.join(", ");
}