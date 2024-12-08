import React, { useEffect, useState } from 'react';
import { store } from "../../redux/Store";
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';


export default function NotificationMenu() {
    const [isOpen, setIsOpen] = useState(false)

    const [messages, setMessages] = useState([]);
    const state = store.getState()
    const user_id = state.id

    // const handleMarkAsRead = (id) => {
    //     setNotifications(messages.filter(notif => notif.id !== id))
    // }

    useEffect(() => {
        // Open WebSocket connection
        const socket = new WebSocket(`ws://localhost:8084/ws/notifications/${user_id}/`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [ data, ...prevMessages,]);
        };

        socket.onclose = () => {
            console.error('WebSocket closed unexpectedly');
        };

        return () => socket.close();
    }, []);

    

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative  bg-sky-500 border-white hover:bg-sky-300  h-8 w-8 rounded-full">
                    <Bell className="h-5 w-5" />
                    {messages.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 h-96 overflow-y-scroll ">
                <h3 className='text-xl font-medium text-white ' >Notification</h3>
                {messages.length === 0 ? (
                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                ) : (
                    messages.map((msg, index) => (
                        <DropdownMenuItem key={index} className="flex flex-col items-start p-2">
                            <div className="flex justify-between w-full">
                                <span className="font-medium">{msg.notification_type}</span>
                                <span className="text-xs text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{msg.message}</p>
                            {msg.notification_type === 'New Message'?
                            (<Link to={`/chat/${msg?.senderId}/`}>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleMarkAsRead(index)}
                                className="mt-1 p-0 h-auto"
                            >
                                Open Chat{ typeof msg?.senderId}
                            </Button>
                            </Link>
                            ):
                             (<Button
                                variant="link"
                                size="sm"
                                onClick={() => handleMarkAsRead(index)}
                                className="mt-1 p-0 h-auto"
                            >
                                Mark as read
                            </Button>)}
                            
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

