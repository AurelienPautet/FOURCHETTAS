//FROM : https://recharts.org/en-US/examples/PieChartWithCustomizedLabel
// mais bien modifié poru mes besoins

import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from "recharts";

function generateAccentColors(count: number): string[] {
  // merci GPT mdrrrrrrr

  const base = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim();
  const baseColor = base || "oklch(60% 0.15 200)";

  function parseOklch(oklch: string): [number, number, number] {
    const match = oklch.match(
      /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/i
    );
    if (!match) {
      return [60, 0.15, 200];
    }
    const [, l, c, h] = match;
    return [parseFloat(l), parseFloat(c), parseFloat(h)];
  }

  function oklchToCss([l, c, h]: [number, number, number]) {
    return `oklch(${l}${l > 1 ? "%" : ""} ${c} ${h})`;
  }

  let lch: [number, number, number];
  if (/oklch\(/i.test(baseColor)) {
    lch = parseOklch(baseColor);
  } else {
    lch = [60, 0.15, 200];
  }

  return Array.from({ length: count }, (_, i) => {
    const hue = (lch[2] + (i * 180) / count) % 360;
    return oklchToCss([lch[0], lch[1], hue]);
  });
}

//const COLORS = ["var(--color-accent)", "#00C49F", "#FFBB28", "#FF0200"];

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={0}
        outerRadius={innerRadius ? innerRadius - 2 : 0}
        startAngle={0}
        endAngle={360}
        fill="var(--color-base-200)"
      />
      <text
        className="font-bold"
        x={cx}
        y={cy ? cy - 10 : 0}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {payload.name} : {value}
      </text>
      <text
        className=""
        x={cx}
        y={cy ? cy + 10 : 0}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {`${((percent ?? 1) * 100).toFixed(2)}%`}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        className="z-30"
        innerRadius={innerRadius ? innerRadius + 2 : 0}
        outerRadius={outerRadius ? outerRadius + 2 : 0}
        startAngle={startAngle}
        endAngle={endAngle}
        stroke="var(--color-shadow)"
        strokeWidth={1}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
    </g>
  );
};

export default function PieItems({
  data,
  labelString = "name",
  colors = [],
}: {
  data: { name: string; value: number }[];
  labelString?: string;
  colors?: string[];
}) {
  const [COLORS, setColors] = useState<string[]>(
    colors.length > 0 ? colors : generateAccentColors(data.length)
  );

  useEffect(() => {
    if (colors.length !== 0) {
      return;
    }
    const updateColors = () => {
      setColors(generateAccentColors(data.length));
    };

    updateColors();

    const observer = new MutationObserver(() => {
      updateColors();
      console.log("Theme changed, colors updated:", COLORS);
    });

    const htmlElement = document.documentElement;
    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["theme_change"],
    });

    return () => {
      observer.disconnect();
    };
  }, [data.length]);

  //const COLORS = generateAccentColors(data.length);

  return (
    <div className="flex flex-col w-[200px] items-center justify-center">
      <div className="shrink-0 relative flex h-[200px] w-[200px] flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="relative" width={500} height={500}>
            <Pie
              className="z-10"
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={60}
              fill="var(--color-base-200)"
              strokeWidth={1}
              stroke="var(--color-base-200)"
              dataKey="value"
            />
            <g className=" absolute top-1/2 left-1/2  z-40">
              <text
                className="font-bold"
                x={100}
                y={100}
                dy={8}
                textAnchor="middle"
                fill={"var(--color-accent)"}
              >
                {labelString}
              </text>
            </g>
            <Pie
              activeShape={renderActiveShape}
              className="z-30"
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="var(--color-accent)"
              stroke="var(--color-shadow)"
              strokeWidth={1}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul>
        {data.map((entry, index) => (
          <li
            key={`legend-${index}`}
            className="flex flex-grow items-center gap-2  animate duration-150 ease-in-out hover:translate-x-2 "
          >
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></span>
            {entry.name} : {entry.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
