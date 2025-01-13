import React, { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  UserPlus2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MapComponent from "@/Page_components/Common/MapComponent";

import { EventsDataContext } from "@/ContextFiles/EventsDataProvider";
import { AnalyticsHosterDataContext } from "@/ContextFiles/AnalyticsHoster";
import { MainGraph } from "@/Page_components/HosterHome/Dashboard/MainGraph";
import CategoryEventPieChart from "@/Page_components/HosterHome/Dashboard/CategoryEventPieChart";
import CategoryParticipantsPieChart from "@/Page_components/HosterHome/Dashboard/CategoryParticipantsPieChart";
import DashboardShimmer from "@/components/Shimmer/Dashboard";

function DashBoard() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: mapdata,
    error: mapError,
    loading: MapLoading,
  } = useContext(EventsDataContext);
  const {
    data: Analyticsdata,
    error: AnalyticsError,
    loading: AnalyticsLoading,
  } = useContext(AnalyticsHosterDataContext);

  if (MapLoading || AnalyticsLoading) return <DashboardShimmer/>;
  if (mapError) return <p>Error loading data</p>;

  console.log("Analyticsdata", Analyticsdata);

  const slides = [
    {
      title: "Faster way to create web pages",
      description:
        "That's my skill. I'm not really specifically talented at anything except for the ability to learn.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Share your knowledge",
      description: "Help others grow while reinforcing your own understanding.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <>
      <div className="flex flex-col">
        <div className="h-40 lg:h-80 mb-4">
          <MapComponent mapEvent={mapdata} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="rounded-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">TODAY'S MONEY</p>
                  <h3 className="text-2xl font-bold">Rs.{Analyticsdata.total_income}</h3>
                  {/* <p className="text-sm">
                    <span className="text-green-500">+55%</span>
                    <span className="text-gray-500"> since yesterday</span>
                  </p> */}
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">TOTAL EVENTS</p>
                  <h3 className="text-2xl font-bold">{Analyticsdata.total_events}</h3>
                  {/* <p className="text-sm">
                    <span className="text-green-500">+3%</span>
                    <span className="text-gray-500"> since last week</span>
                  </p> */}
                </div>
                <div className="bg-red-500 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">TOTAL PARTICIPANTS</p>
                  <h3 className="text-2xl font-bold">{Analyticsdata.total_participants}</h3>
                  {/* <p className="text-sm">
                    <span className="text-red-500">-2%</span>
                    <span className="text-gray-500"> since last quarter</span>
                  </p> */}
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <UserPlus2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="rounded-none">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">SALES</p>
                  <h3 className="text-2xl font-bold">$103,430</h3>
                  <p className="text-sm">
                    <span className="text-green-500">+5%</span>
                    <span className="text-gray-500"> than last month</span>
                  </p>
                </div>
                <div className="bg-orange-500 p-3 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <MainGraph chartData={Analyticsdata.overall_event_participant} />

        <Card className="flex flex-col w-2/3">
          <CardHeader className="flex-row items-start space-y-0 pb-0">
            <CardTitle>Category Analysis</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2  ">
            <CategoryEventPieChart
              PieData={Analyticsdata.event_count_on_catgory}
            />
            <CategoryParticipantsPieChart
              PieData={Analyticsdata.participant_count_on_category}
            />
          </div>
        </Card>

        {/* Charts and Carousel Grid */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br h-[400px] relative overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      } bg-gradient-to-br ${slide.color}`}
                    >
                      <div className="p-8 text-white h-full flex flex-col justify-end">
                        <h3 className="text-2xl font-bold mb-4">
                          {slide.title}
                        </h3>
                        <p className="text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? slides.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === slides.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
         
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br h-[400px] relative overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      } bg-gradient-to-br ${slide.color}`}
                    >
                      <div className="p-8 text-white h-full flex flex-col justify-end">
                        <h3 className="text-2xl font-bold mb-4">
                          {slide.title}
                        </h3>
                        <p className="text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? slides.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === slides.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
       
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br h-[400px] relative overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      } bg-gradient-to-br ${slide.color}`}
                    >
                      <div className="p-8 text-white h-full flex flex-col justify-end">
                        <h3 className="text-2xl font-bold mb-4">
                          {slide.title}
                        </h3>
                        <p className="text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? slides.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === slides.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
       
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br h-[400px] relative overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      } bg-gradient-to-br ${slide.color}`}
                    >
                      <div className="p-8 text-white h-full flex flex-col justify-end">
                        <h3 className="text-2xl font-bold mb-4">
                          {slide.title}
                        </h3>
                        <p className="text-white/80">{slide.description}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? slides.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === slides.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default DashBoard;
