'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Clock, Users, DollarSign, Video, Image as ImageIcon, CheckCircle, XCircle, Ticket, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useParams } from 'react-router-dom'
import axiosInstance from '@/axiosconfig'
import MapEvent from '@/Page_components/Common/MapEvent'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock event data
const event = {
    id: 1,
    title: 'Tech Conference 2024',

    banner_image: '/placeholder.svg?height=400&width=800',
    promo_video: 'https://example.com/promo1.mp4',

    updated_at: '2024-01-15T14:30:00',
    status: 'Upcoming',
    approval_status: 'Approved',
    approval_comments: 'Event meets all requirements',
    approval_updated_at: '2024-01-10T11:20:00',
}

export default function EventDetails() {
    const { event_id } = useParams();
    const numericEventId = Number(event_id);
    const [cateData, setCateData] = useState(null)
    const [participants, setParticipants] = useState([])
    const fetchCategoryDetails = async () => {
        try {
            const response = await axiosInstance.get(`/events/event/${numericEventId}/`)

            console.log(response.data)
            setCateData(response.data)
            console.log('event data', cateData?.event_data)


        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (cateData) {
            const key_participants_data = cateData?.event_data?.key_participants

            const updatedParticipants = key_participants_data.map((participant) => ({
                ...participant,
                id: Date.now() + Math.random()
            }));

            setParticipants(updatedParticipants);

            console.log("Participants updated:", updatedParticipants);
        }
    }, [cateData])


    useEffect(() => {

        fetchCategoryDetails()
    }, [])

    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    })



    if (!cateData) return <p>Loading...</p>;

    // if (!cateData) return <p>Error loading data</p>;
    console.log('cate event data', cateData)


    const handleApproveStatus = async (status) => {
        const eventId = cateData.event_data.id; // Assuming `cateData` contains the event details.

        await toast.promise(
            axiosInstance.post(
                `http://localhost:8000/events/event/${eventId}/update_status/`,
                { approval_status: status }
            ),
            {
                loading: `Updating event status to ${status}...`,
                success: () => {
                    // Fetch updated event details after success
                    fetchCategoryDetails();
                    return `Event has been ${status} successfully!`;
                },
                error: (err) => {
                    console.error("Error updating approval status:", err);
                    return `Failed to ${status} the event. Please try again.`;
                },
            }
        );
    };


    return (

        <div className="max-w-4xl mx-auto">
            <Card>
                <CardContent className="p-6">
                    <div className=" mb-6 ">
                        <div className="w-full h-full aspect-w-16 aspect-h-9 flex items-center justify-center">
                            <img
                                src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${cateData.event_data.banner_image}.jpg`}
                                alt={event.title}
                                className="object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{cateData.event_data.title}</h1>
                            <h3 className=" font-semibold ">Description:</h3>
                            <div className="flex items-center text-white-200 mb-2">
                                {/* <MapPin className="h-4 w-4 mr-2" /> */}
                                {cateData.event_data.description}
                                {/* {event.address_line_1}, {event.city}, {event.state}, {event.country} */}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge>{cateData.event_data.category}</Badge>
                                <Badge variant="secondary">{cateData.event_data.type}</Badge>
                            </div>
                        </div>
                        {/* <div className="text-right">
                            <div className="text-2xl font-bold mb-1">
                                {event.payment_required ? `$${event.ticket_price.toFixed(2)}` : 'Free'}
                            </div>
                            <div className="text-sm text-gray-600">
                                {event.participant_capacity} spots available
                            </div>
                        </div> */}
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="font-medium">Start:</span>
                                        <span className="ml-2">{new Date(cateData.event_data.start_date_time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-red-500" />
                                        <span className="font-medium">End:</span>
                                        <span className="ml-2">{new Date(cateData.event_data.end_date_time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                        <span className="font-medium">Registration Deadline:</span>
                                        <span className="ml-2">{new Date(cateData.event_data.registration_deadline).toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Ticket details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Ticket className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="font-medium">Registration Type:</span>
                                        <span className="ml-2">{cateData.event_data.payment_required ? 'Payment' : 'Free Registration'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                                        <span className="font-medium">Registration Amount:</span>
                                        <span className="ml-2">{cateData.event_data.payment_required ? `Rs.${cateData.event_data.ticket_price}` : 'Nil'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2 text-yellow-500" />
                                        <span className="font-medium">Total Capacity:</span>
                                        <span className="ml-2">{cateData.event_data.participant_capacity} spots available</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Address Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <span className="font-medium">Address:</span>
                                            <span className="ml-2">{cateData.event_data.address_line_1}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">City:</span>
                                            <span className="ml-2">
                                                {cateData.event_data.city}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">State:</span>
                                            <span className="ml-2">
                                                {cateData.event_data.state}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium">Country:</span>
                                            <span className="ml-2">
                                                {cateData.event_data.country}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-2">Location</h2>
                            <div className="aspect-video relative rounded-lg overflow-hidden">
                                <MapEvent mapEvent={[cateData.event_data]} />
                            </div>
                        </div>

                        <Card  >
                            <CardHeader >
                                <CardTitle >Key Participants </CardTitle>

                            </CardHeader>
                            <CardContent className='max-h-[400px] overflow-y-auto '>
                                {participants.length === 0 ? (
                                    <p className="text-center text-gray-500">No participants added yet.</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {participants.map((participant) => (
                                            <li key={participant.id} className="flex items-center justify-between border bg-zinc-900 p-4 rounded-lg">
                                                <div className='flex items-center justify-between gap-3'>
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage className='object-cover' src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1732125377/${participant.photo}.jpg`} />
                                                        <AvatarFallback>Photo</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold">{participant.name}</h3>
                                                        <p className="text-sm text-gray-600">{participant.role}</p>
                                                    </div>
                                                </div>

                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Event Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2">
                                    {cateData.event_data.status === 'Active' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    )}
                                    <span className="font-medium">{cateData.event_data.status}</span>
                                </div>
                                {/* <p className="text-sm text-gray-600">{event.approval_comments}</p> */}
                                <div className="text-sm text-gray-500 mt-2">
                                    Last updated: {new Date(cateData.event_data.updated_at).toLocaleString()}
                                </div>

                                <div className="mt-8 gap-2">
                                    {cateData.event_data.status_request ? (
                                        <div className='flex items-center gap-2'>
                                            {cateData.event_data.status === 'Active' && <p>Waiting for the request to cancel -</p>}
                                            {cateData.event_data.status === 'Cancelled' && <p>Waiting for the request to active -</p>}
                                            {/* <Button onClick={() => handleEventStatus('Cancelled')}>Cancel event</Button> */}
                                            <Button onClick={() => handleApproveStatus('Allow request')}>Allow request</Button>
                                            <Button onClick={() => handleApproveStatus('Reject request')}>Reject request</Button>
                                        </div>) :
                                        (
                                            cateData.event_data.status != 'Cancelled' && cateData.event_data.approval_status != 'Waiting for approval' && cateData.event_data.status != 'Cancelled by Admin' &&
                                            (<div>
                                                <div className='flex items-center gap-2'>
                                                    <p>Do you want to cancel this event?</p>
                                                    <Button onClick={() => handleApproveStatus('Cancelled by Admin')}>Cancel event</Button>
                                                </div>
                                            </div>)
                                        )
                                    }
                                </div>
                            </CardContent>
                        </Card>



                        <Card>
                            <CardHeader>
                                <CardTitle>Approval Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center mb-2">
                                    {cateData.event_data.approval_status === 'Approved' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    )}
                                    <span className="font-medium">{cateData.event_data.approval_status}</span>
                                </div>
                                {/* <p className="text-sm text-gray-600">{event.approval_comments}</p> */}
                                <div className="text-sm text-gray-500 mt-2">
                                    Last updated: {new Date(cateData.event_data.approval_updated_at).toLocaleString()}
                                </div>
                                {cateData.event_data.approval_status === 'Waiting for approval' && <div className="mt-8 flex justify-center gap-2">
                                    <Button onClick={() => handleApproveStatus('Approved')}>Approve</Button>
                                    <Button onClick={() => handleApproveStatus('Rejected')}>Reject</Button>
                                </div>}
                            </CardContent>
                        </Card>
                    </div>


                </CardContent>
            </Card>
        </div>
    )
}