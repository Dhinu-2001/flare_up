import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const speakers = [
  {
    name: "Sarah Chen",
    title: "CEO & Founder",
    organization: "@Digital Ventures",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Michael Roberts",
    title: "Head of Technology",
    organization: "@Tech Solutions",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "Emma Thompson",
    title: "Lead Designer",
    organization: "@Creative Studios",
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    name: "David Wilson",
    title: "Director of Innovation",
    organization: "@Future Labs",
    image: "/placeholder.svg?height=400&width=300",
  },
]

export function ParticipantCarousel({ participants }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 ">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full">
        <CarouselContent className="ml-2 md:ml-4">
          {participants.map((participant, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="border-0 bg-gray-900 h-80 overflow-hidden">
                <CardContent className="p-0">
                  <div className=" overflow-hidden rounded-t-lg">
                    <div className="p-4 w-full flex-col  items-center text-center">
                      <h3 className="text-xl font-semibold mb-1">{participant.name}</h3>
                      <p className="text-gray-400 text-sm mb-1">{participant.role}</p>
                      <p className="text-gray-500 text-sm">{participant.bio}</p>
                    </div>
                    <img
                      src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1732125377/${participant.photo}.jpg`}
                      alt=""
                      className="object-cover w-full"
                      priority={index < 2}
                    />


                  </div>
                  {/* <div className="bg-slate-400 p-4 text-white">
                    <h3 className="text-xl font-semibold ">{participant.name}</h3>
                    <p className="text-gray-400 text-sm">{participant.role}</p>
                    <p className="text-gray-500 text-sm">{participant.bio}</p>
                  </div> */}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 bg-white/10 hover:bg-white/20 border-0 text-white" />
        <CarouselNext className="hidden md:flex -right-12 bg-white/10 hover:bg-white/20 border-0 text-white" />
      </Carousel>
    </div>
  )
}

