import React, { useEffect, useState } from 'react';
import { store } from "../../../redux/Store";
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'react-router-dom';


const mockNotifications = [
    { id: '1', title: 'New message', description: 'You have a new message from John', time: '5 min ago' },
    { id: '2', title: 'Meeting reminder', description: 'Team meeting in 30 minutes', time: '30 min ago' },
    { id: '3', title: 'Task completed', description: 'Project X has been marked as complete', time: '1 hour ago' },
]

export default function NotificationMenu() {
    const [notifications, setNotifications] = useState(mockNotifications)
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
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.onclose = () => {
            console.error('WebSocket closed unexpectedly');
        };
        
        console.log('messages',messages)

        return () => socket.close();
    }, []);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {messages.length > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
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
                                Open Chat
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

