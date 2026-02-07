export type Flag = "normal" | "gap_estimated" | "counter_reset";
export interface RawInfo {
  meterId: string;
  timestamp: string;
  cumulativeVol: number;
}
export interface HourlyInfo {
  meterId: string;
  hour: string;
  consumption: number;
  flag: Flag;
}
