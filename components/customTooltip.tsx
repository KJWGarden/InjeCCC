import { TooltipProps } from "recharts";

export default function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border rounded shadow-md text-sm">
        <p className="font-semibold">채운시간: {payload[0].value} 시간</p>
      </div>
    );
  }

  return null;
}
