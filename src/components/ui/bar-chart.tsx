
import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGrid?: boolean;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ["primary"],
  valueFormatter = (value: number) => `${value}`,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  showGrid = true,
  className,
}: BarChartProps) {
  // Create chart config based on categories and colors
  const chartConfig: ChartConfig = React.useMemo(() => {
    return categories.reduce<ChartConfig>((config, category, i) => {
      config[category] = {
        label: category,
        color: `hsl(var(--${colors[i % colors.length]}))`,
      };
      return config;
    }, {});
  }, [categories, colors]);

  return (
    <ChartContainer className={className} config={chartConfig}>
      <RechartsBarChart data={data}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {showXAxis && <XAxis dataKey={index} />}
        {showYAxis && <YAxis />}
        <Tooltip
          content={({ active, payload, label }) => (
            <ChartTooltipContent
              active={active}
              payload={payload}
              label={label}
              formatter={(value) => valueFormatter(Number(value))}
            />
          )}
        />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={`hsl(var(--${colors[i % colors.length]}))`}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
}
