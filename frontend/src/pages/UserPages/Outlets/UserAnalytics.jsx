import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { ChartContainer, ChartStyle } from "@/components/ui/chart";
import { Music, Dumbbell, Laptop } from "lucide-react";

// Mock data
const monthlyData = {
  totalEvents: 8,
  categories: [
    { name: "Music", count: 4, icon: Music, color: "bg-blue-500" },
    { name: "Sports", count: 2, icon: Dumbbell, color: "bg-green-500" },
    { name: "Tech", count: 2, icon: Laptop, color: "bg-purple-500" },
    { name: "Education", count: 4, icon: Music, color: "bg-blue-500" },
    { name: "Cultural", count: 2, icon: Dumbbell, color: "bg-green-500" },
    { name: "Business", count: 2, icon: Laptop, color: "bg-purple-500" },
  ],
};

const yearlyData = {
  totalEvents: 24,
  categories: [
    { name: "Music", count: 12, icon: Music, color: "bg-blue-500" },
    { name: "Sports", count: 10, icon: Dumbbell, color: "bg-green-500" },
    { name: "Tech", count: 6, icon: Laptop, color: "bg-purple-500" },
    { name: "Education", count: 4, icon: Music, color: "bg-blue-500" },
    { name: "Cultural", count: 2, icon: Dumbbell, color: "bg-green-500" },
    { name: "Business", count: 2, icon: Laptop, color: "bg-purple-500" },
  ],
};

export default function UserAnalytics() {
  const [timeFrame, setTimeFrame] = useState("month");
  const data = timeFrame === "month" ? monthlyData : yearlyData;
  const maxEvents = Math.max(...data.categories.map((cat) => cat.count));

  const radialData = [
    {
      name: "Events",
      value: data.totalEvents,
      fill: "hsl(var(--primary))",
    },
  ];

  const chartConfig = {
    primaryColor: "hsl(var(--primary))",
    radialBar: {
      theme: "rounded",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Track your event booking activity</CardDescription>
          <RadioGroup
            defaultValue="month"
            onValueChange={(value) => setTimeFrame(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month">Last Month</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="year" id="year" />
              <Label htmlFor="year">Last Year</Label>
            </div>
          </RadioGroup>
        </CardHeader>
        <CardContent className="grid gap- md:grid-cols-2">
          {/* Radial Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Total Events Booked</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer
                config={chartConfig.radialBar}
                className="w-[200px] h-[200px]"
              >
                <RadialBarChart
                  data={radialData}
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={10}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, timeFrame === "month" ? 50 : 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={30}
                    fill="var(--primary)"
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-primary text-3xl font-bold"
                  >
                    {data.totalEvents}
                  </text>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category Progress Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 h-60 overflow-y-scroll">
              {data.categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {category.count} events
                      </span>
                    </div>
                    <Progress
                      value={(category.count / maxEvents) * 100}
                      className={`h-2 ${category.color}`}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          {/* <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {data.categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.name}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {category.name} Events
                            </p>
                            <p className="text-2xl font-bold">
                              {category.count}
                            </p>
                          </div>
                          <Icon
                            className={`w-8 h-8 ${category.color} rounded-full p-1.5 text-white`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card> */}
        </CardContent>
      </Card>
    </div>
  );
}
