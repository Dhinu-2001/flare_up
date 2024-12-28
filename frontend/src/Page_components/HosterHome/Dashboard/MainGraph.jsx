import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// ChartConfig,

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// const chartData = [
//   { date: "2024-10-01", desktop: 222, mobile: 150 },
//   { date: "2024-10-02", desktop: 97, mobile: 180 },
//   { date: "2024-10-03", desktop: 167, mobile: 120 },
//   { date: "2024-10-04", desktop: 242, mobile: 260 },
//   { date: "2024-10-05", desktop: 373, mobile: 290 },
//   { date: "2024-10-06", desktop: 301, mobile: 340 },
//   { date: "2024-10-07", desktop: 245, mobile: 180 },
//   { date: "2024-10-08", desktop: 409, mobile: 320 },
//   { date: "2024-10-09", desktop: 59, mobile: 110 },
//   { date: "2024-10-10", desktop: 261, mobile: 190 },
//   { date: "2024-10-11", desktop: 327, mobile: 350 },
//   { date: "2024-10-12", desktop: 292, mobile: 210 },
//   { date: "2024-10-13", desktop: 342, mobile: 380 },
//   { date: "2024-10-14", desktop: 137, mobile: 220 },
//   { date: "2024-10-15", desktop: 120, mobile: 170 },
//   { date: "2024-10-16", desktop: 138, mobile: 190 },
//   { date: "2024-10-17", desktop: 446, mobile: 360 },
//   { date: "2024-10-18", desktop: 364, mobile: 410 },
//   { date: "2024-10-19", desktop: 243, mobile: 180 },
//   { date: "2024-10-20", desktop: 89, mobile: 150 },
//   { date: "2024-10-21", desktop: 137, mobile: 200 },
//   { date: "2024-10-22", desktop: 224, mobile: 170 },
//   { date: "2024-10-23", desktop: 138, mobile: 230 },
//   { date: "2024-10-24", desktop: 387, mobile: 290 },
//   { date: "2024-10-25", desktop: 215, mobile: 250 },
//   { date: "2024-10-26", desktop: 75, mobile: 130 },
//   { date: "2024-10-27", desktop: 383, mobile: 420 },
//   { date: "2024-10-28", desktop: 122, mobile: 180 },
//   { date: "2024-10-29", desktop: 315, mobile: 240 },
//   { date: "2024-10-30", desktop: 454, mobile: 380 },
//   { date: "2024-11-01", desktop: 165, mobile: 220 },
//   { date: "2024-11-02", desktop: 293, mobile: 310 },
//   { date: "2024-11-03", desktop: 247, mobile: 190 },
//   { date: "2024-11-04", desktop: 385, mobile: 420 },
//   { date: "2024-11-05", desktop: 481, mobile: 390 },
//   { date: "2024-11-06", desktop: 498, mobile: 520 },
//   { date: "2024-11-07", desktop: 388, mobile: 300 },
//   { date: "2024-11-08", desktop: 149, mobile: 210 },
//   { date: "2024-11-09", desktop: 227, mobile: 180 },
//   { date: "2024-11-10", desktop: 293, mobile: 330 },
//   { date: "2024-11-11", desktop: 335, mobile: 270 },
//   { date: "2024-11-12", desktop: 197, mobile: 240 },
//   { date: "2024-11-13", desktop: 197, mobile: 160 },
//   { date: "2024-11-14", desktop: 448, mobile: 490 },
//   { date: "2024-11-15", desktop: 473, mobile: 380 },
//   { date: "2024-11-16", desktop: 338, mobile: 400 },
//   { date: "2024-11-17", desktop: 499, mobile: 420 },
//   { date: "2024-11-18", desktop: 315, mobile: 350 },
//   { date: "2024-11-19", desktop: 235, mobile: 180 },
//   { date: "2024-11-20", desktop: 177, mobile: 230 },
//   { date: "2024-11-21", desktop: 82, mobile: 140 },
//   { date: "2024-11-22", desktop: 81, mobile: 120 },
//   { date: "2024-11-23", desktop: 252, mobile: 290 },
//   { date: "2024-11-24", desktop: 294, mobile: 220 },
//   { date: "2024-11-25", desktop: 201, mobile: 250 },
//   { date: "2024-11-26", desktop: 213, mobile: 170 },
//   { date: "2024-11-27", desktop: 420, mobile: 460 },
//   { date: "2024-11-28", desktop: 233, mobile: 190 },
//   { date: "2024-11-29", desktop: 78, mobile: 130 },
//   { date: "2024-11-30", desktop: 340, mobile: 280 },
//   { date: "2024-11-31", desktop: 178, mobile: 230 },
//   { date: "2024-12-01", desktop: 178, mobile: 200 },
//   { date: "2024-12-02", desktop: 470, mobile: 410 },
//   { date: "2024-12-03", desktop: 103, mobile: 160 },
//   { date: "2024-12-04", desktop: 439, mobile: 380 },
//   { date: "2024-12-05", desktop: 88, mobile: 140 },
//   { date: "2024-12-06", desktop: 294, mobile: 250 },
//   { date: "2024-12-07", desktop: 323, mobile: 370 },
//   { date: "2024-12-08", desktop: 385, mobile: 320 },
//   { date: "2024-12-09", desktop: 438, mobile: 480 },
//   { date: "2024-12-10", desktop: 155, mobile: 200 },
//   { date: "2024-12-11", desktop: 92, mobile: 150 },
//   { date: "2024-12-12", desktop: 492, mobile: 420 },
//   { date: "2024-12-13", desktop: 81, mobile: 130 },
//   { date: "2024-12-14", desktop: 426, mobile: 380 },
//   { date: "2024-12-15", desktop: 307, mobile: 350 },
//   { date: "2024-12-16", desktop: 371, mobile: 310 },
//   { date: "2024-12-17", desktop: 475, mobile: 520 },
//   { date: "2024-12-18", desktop: 107, mobile: 170 },
//   { date: "2024-12-19", desktop: 341, mobile: 290 },
//   { date: "2024-12-20", desktop: 408, mobile: 450 },
//   { date: "2024-12-21", desktop: 169, mobile: 210 },
//   { date: "2024-12-22", desktop: 317, mobile: 270 },
//   { date: "2024-12-23", desktop: 480, mobile: 530 },
//   { date: "2024-12-24", desktop: 132, mobile: 180 },
//   { date: "2024-12-25", desktop: 141, mobile: 190 },
//   { date: "2024-12-26", desktop: 434, mobile: 380 },
//   { date: "2024-12-27", desktop: 448, mobile: 490 },
//   { date: "2024-12-28", desktop: 149, mobile: 200 },
//   { date: "2024-12-29", desktop: 103, mobile: 160 },
//   { date: "2024-12-30", desktop: 446, mobile: 400 },
// ]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  events: {
    label: "Events",
    color: "hsl(var(--chart-1))",
  },
  participants: {
    label: "Participants",
    color: "hsl(var(--chart-2))",
  },
} 
// satisfies ChartConfig

export function MainGraph({chartData}) {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date(new Date().toISOString().split('T')[0]);
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total events and participants for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillParticipants" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-participants)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-participants)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="participants"
              type="natural"
              fill="url(#fillParticipants)"
              stroke="var(--color-participants)"
              stackId="a"
            />
            <Area
              dataKey="events"
              type="natural"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
