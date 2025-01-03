"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  Languages,
  Laptop,
  Gamepad,
  FileQuestion,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "AWS Cloud Practitioner Essentials",
    type: "Digital Course",
    duration: "7h 00m",
    rating: 5,
    language: "English",
  },
  {
    id: 2,
    title: "AWS Technical Essentials",
    type: "Digital Course",
    duration: "4h 00m",
    rating: 5,
    language: "English",
  },
  {
    id: 3,
    title:
      "Exam Prep Official Question Set: AWS Certified Cloud Practitioner (CLF-C02)",
    type: "Exam Preparation",
    duration: "0h 30m",
    rating: 5,
    language: "English",
  },
  {
    id: 4,
    title: "AWS Cloud Quest: Cloud Practitioner",
    type: "Game-Based Learning",
    duration: "12h 00m",
    rating: 0,
    language: "English",
  },
];

export default function BookedEventList() {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Digital Course":
        return <Laptop className="h-4 w-4" />;
      case "Exam Preparation":
        return <FileQuestion className="h-4 w-4" />;
      case "Game-Based Learning":
        return <Gamepad className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-6 lg:px-8">
      <div className="w-full h-full max-w-7xl mx-auto ">
        <h2 className="text-1xl md:text-2xl lg:text-2xl font-bold text-[#00ffcc] mb-8">
          Profile
        </h2>
        <div className="w-full px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Recommended for you</h2>
              <p className="text-muted-foreground">
                Personalized recommendations for further training
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {courses.map((course) => (
              <Card
                key={course.id}
                className="min-w-[300px] flex-shrink-0 snap-start"
              >
                <div className="aspect-video bg-muted relative">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Laptop className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    {getTypeIcon(course.type)}
                    <span>{course.type}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{course.rating || "--"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Languages className="h-4 w-4" />
                      <span>{course.language}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
