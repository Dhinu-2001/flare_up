"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
// import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// [
//     { month: "january", desktop: 186, fill: "var(--color-january)" },
//     { month: "february", desktop: 305, fill: "var(--color-february)" },
//     { month: "march", desktop: 237, fill: "var(--color-march)" },
//     { month: "april", desktop: 173, fill: "var(--color-april)" },
//     { month: "may", desktop: 209, fill: "var(--color-may)" },
//   ]

const desktopData = 
[
    {
        "category": "Corporate",
        "events": 0,
        "fill": "var(--color-Corporate)"
    },
    {
        "category": "Music",
        "events": 1,
        "fill": "var(--color-Music)"
    },
    {
        "category": "Tech",
        "events": 2,
        "fill": "var(--color-Tech)"
    },
    {
        "category": "Educational Event",
        "events": 0,
        "fill": "var(--color-Educational Event)"
    },
    {
        "category": "Cultural & Community",
        "events": 0,
        "fill": "var(--color-Corporate)"
    },
    {
        "category": "Sports",
        "events": 0,
        "fill": "var(--color-Sports)"
    }
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  events: {
    label: "Events",
  },
  mobile: {
    label: "Mobile",
  },
  Corporate: {
    label: "Corporate",
    color: "hsl(var(--chart-1))",
  },
  Music: {
    label: "Music",
    color: "hsl(var(--chart-2))",
  },
  Tech: {
    label: "Tech",
    color: "hsl(var(--chart-3))",
  },
  Sports: {
    label: "Sports",
    color: "hsl(var(--chart-4))",
  },
  'Educational Event': {
    label: "Educational Event",
    color: "hsl(var(--chart-5))",
  },
}

 export default function CategoryParticipantsPieChart() {
  const id = "pie-interactive"
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].category)

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.category === activeMonth),
    [activeMonth]
  )
  const categories = React.useMemo(() => desktopData.map((item) => item.category), [])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart - Interactive</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categories.map((key) => {
              const strkey = String(key)
              console.log(strkey, "strkey")
              const config = chartConfig[key]

              if (!config) {
                return null
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs ">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: config.color,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="events"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {desktopData[activeIndex].events.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}