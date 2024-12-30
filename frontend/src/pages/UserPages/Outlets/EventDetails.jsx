'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, MapPin, Calendar, Timer, Users, Ticket, Clock, Image as ImageIcon, Locate } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '@/axiosconfig'
import MapEvent from '@/Page_components/Common/MapEvent'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedVideo, responsive, placeholder } from "@cloudinary/react";
import { ParticipantCarousel } from '@/Page_components/Common/ParticipantCarousel'
import { MessageCircle } from 'lucide-react'
import PreLoader from '@/Page_components/PreLoader/PreLoader'
import EventDetailShimmer from '@/components/Shimmer/TicketBooking'

export default function EventDetails() {
  const { event_id } = useParams()
  const numericEventId = Number(event_id);
  const [eventData, setEventData] = useState(null)
  const [myVideo, setMyVideo] = useState(null)
  const [cloudName] = useState("dzwjm8n8v");
  const [isHovered, setIsHovered] = useState(false)

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  if (!event_id) return <p>Error no category.</p>

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const fetchCategoryDetails = async () => {
    try {
      const response = await axiosInstance.get(`/events/event/${numericEventId}/`)

      console.log(response.data)
      setEventData(response.data)
      // setMyVideo(cld.image(eventData.event_data.promo_video))

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    fetchCategoryDetails()
    // Set your target date here
    const targetDate = new Date('2024-12-31')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!eventData) return <PreLoader/>

                                       
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-6">

      {/* Hero Section */}
      <div className="relative">
        <video
          autoPlay
          loop
          muted
          className='absolute inset-0 w-full h-full object-cover '
        >
          <source
            src={`https://res.cloudinary.com/dzwjm8n8v/video/upload/v1731568818/${eventData.event_data.promo_video}.mp4`} />
          Your browser does not support the video tag.
        </video>
        <img
          src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${eventData.event_data.banner_image}.jpg`}
          alt="NBA 2K League Background"
          width={1920}
          height={1080}
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0">
          <div className="container mx-auto px-4 py-12 h-full flex">
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              <img
                src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${eventData.event_data.banner_image}.jpg`}
                alt="NBA 2K League Logo"
                width={200}
                height={80}
                className="mb-8"
              />
              <h1 className="text-5xl font-bold mb-6">{eventData.event_data.title}</h1>
              <p className="text-xl mb-12">
                {eventData.event_data.description}
              </p>
              {/* <div className="grid grid-cols-3 gap-4 bg-[#1a237e] p-6 rounded-lg">
                <div>
                  <div className="text-4xl font-bold">30 MILLION</div>
                  <div className="text-sm">Live broadcast views</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">91 MILLION</div>
                  <div className="text-sm">Instagram video views</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">3.3 MILLION</div>
                  <div className="text-sm">Social engagements</div>
                </div>
              </div> */}
            </div>

            {/* Countdown Timer */}
            <div className="hidden lg:flex items-center justify-center w-96">
              {/* <div className="bg-black/80 p-8 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Next Season Starts In:</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm">Days</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm">Hours</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <Link to={`/chat/${eventData.user_data.id}/`}>
          <Button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-sky-400 p-0 shadow-lg transition-all hover:scale-110 hover:bg-sky-200"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <MessageCircle
              className={`h-6 w-6 text-background transition-transform ${isHovered ? 'scale-110' : 'scale-100'
                }`}
            />
            <span className="sr-only">Open messages</span>
          </Button>
        </Link>

      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Highlights</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <MapEvent mapEvent={[eventData.event_data]} />
            {/* <video
              className="w-full h-full object-cover"
              poster="/placeholder.svg"
              controls
            >
              <source src="/video-placeholder.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 text-stone-300">Season 5 Highlights</h3>
              <p className="text-zinc-400">Best plays from the 2023 NBA 2K League Season</p>
            </div> */}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-10">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Start:</span>
                  <span className="ml-2">{new Date(eventData.event_data.start_date_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-red-500" />
                  <span className="font-medium">End:</span>
                  <span className="ml-2">{new Date(eventData.event_data.end_date_time).toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="font-medium">Registration Deadline:</span>
                  <span className="ml-2">{new Date(eventData.event_data.registration_deadline).toLocaleString()}</span>
                </div>
              </div>
              <h2 className='text-2xl font-semibold ml-0 m-4 '>Event Address</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Locate className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="font-medium">Address</span>
                  <span className="ml-2">{eventData.event_data.address_line_1}</span>
                </div>
                <div className="flex items-center">

                  <span className="font-medium">City</span>
                  <span className="ml-2">{eventData.event_data.city}</span>
                </div>
                <div className="flex items-center">

                  <span className="font-medium">State</span>
                  <span className="ml-2">{eventData.event_data.state}</span>
                </div>
                <div className="flex items-center">

                  <span className="font-medium">Country</span>
                  <span className="ml-2">{eventData.event_data.country}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <div className='my-5'>
        <ParticipantCarousel participants={eventData?.event_data?.key_participants} />
      </div>

      <div className="bg-zinc-900">
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-8">Event Video</h2>
              {/* <AdvancedVideo
                style={{ maxWidth: "100%" }}
                cldVid={myVideo}
                controls
                plugins={[responsive(), placeholder()]}
              /> */}
              <video
                className="w-full h-2/3 object-cover rounded-md"
                controls>
                <source
                  src={`https://res.cloudinary.com/dzwjm8n8v/video/upload/v1731568818/${eventData.event_data.promo_video}.mp4`}
                />
                Your browser does not support the video tag.
              </video>
              {/* <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-stone-300">Season 5 Highlights</h3>
                <p className="text-zinc-400">Best plays from the 2023 NBA 2K League Season</p>
              </div> */}
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-8">Ticket Information</h2>
              <Card className="bg-black p-6">
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <div>

                    </div>
                    {/* <Badge className="bg-emerald-400 text-black">$199</Badge> */}
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ticket details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Registration Type:</span>
                          <span className="ml-2">{eventData.event_data.payment_required ? 'Payment' : 'Free Registration'}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Registration Amount:</span>
                          <span className="ml-2">{eventData.event_data.payment_required ? `Rs.${eventData.event_data.ticket_price}` : 'Nil'}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="font-medium">Total Capacity:</span>
                          <span className="ml-2">{eventData.event_data.participant_capacity} spots available</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Link to={`/catgory/${eventData.event_data.category}/${eventData.event_data.type}/${eventData.event_data.id}/ticket_registration`}>
                    <Button className=" bg-blue-500 text-black hover:bg-blue-800 rounded-none">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}