"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { Flag, HourlyInfo } from "../lib/types"; 
import { colorFlag, formatTooltipValue, safeNumber } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type RectProps = ComponentPropsWithoutRef<"rect">;

type ChartRow = { flag: Flag };

type BarShapeProps = Omit<RectProps, "x" | "y" | "width" | "height" | "fill"> & {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: Pick<ChartRow, "flag">;
};


export const BarByFlagShape = (props: BarShapeProps) => {
  const {
    x,
    y,
    width,
    height,
    payload,
    rx,
    ry,
    className,
    style,
    opacity,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    role,
    tabIndex,
    "aria-label": ariaLabel,

  } = props;

  const safeX = x ?? 0;
  const safeY = y ?? 0;
  const safeW = width ?? 0;
  const safeH = height ?? 0;

  const flag: Flag = payload?.flag ?? "normal";

  return (
    <rect
      x={safeX}
      y={safeY}
      width={safeW}
      height={safeH}
      rx={typeof rx === "number" ? rx : 2}
      ry={typeof ry === "number" ? ry : 2}
      fill={colorFlag(flag)}
      className={className}
      style={style}
      opacity={opacity}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}


export const ConsumptionChart = ({
  records,
}: {
  records: HourlyInfo[];
}) => {
  const data: ChartRow[] = records.map((r) => ({
    hour: `${r.hour.slice(11, 13)}:00`,
    consumption: safeNumber(r.consumption),
    flag: r.flag,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip formatter={(value: ValueType | undefined, name: NameType | undefined) => [
            formatTooltipValue(value ?? 0),
            String(name ?? ""),
          ]} />
          <Bar dataKey="consumption" shape={<BarByFlagShape />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
