import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { store } from '@/redux/Store';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import ChatList from './ChatList';
import axiosInstance from '@/axiosconfig';
import { format } from 'date-fns';
import ChatShimmer from '@/components/Shimmer/Chat';
import { env } from "@/utils/env";

import { getConfig } from '../../config';
let { VITE_notification_svc } = getConfig();

VITE_notification_svc = VITE_notification_svc || env.VITE_notification_svc


const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, "MMMM do, yyyy 'at' h:mm a");
};

const Chat = () => {
    const state = store.getState()
    const senderId = state.id
    const senderName = state.username ? state.username : 'User';

    const [receiverId, setReceiverId] = useState(null)
    const [roomName, setRoomName] = useState(null)
    const [recieverData, setRecieverData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const { reciever_id } = useParams();
    console.log({ reciever_id })
    const receiverid = Number(reciever_id)
    console.log(receiverid)

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socketRef = React.useRef(null);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`user/${receiverid}/`)
            console.log('reciever data', response.data)
            setRecieverData(response.data)
            setLoading(false)
        } catch (err) {
            console.log(err)
        }
    }

    const callWebsocket = async () => {
        try {

            setReceiverId(receiverid)
            const room_array = [senderId, receiverid];

            room_array.sort((a, b) => a - b);

            setRoomName(`chat_${room_array[0]}-${room_array[1]}`)
            console.log('receiverid', receiverid, senderId)
            console.log('roomName', roomName)

            if (roomName) {
                // Connect to WebSocket
                socketRef.current = new WebSocket(`ws://${VITE_notification_svc}/ws/chat/${roomName}/`);
                

                // Handle incoming messages
                socketRef.current.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    setMessages((prev) => [...prev, data]);
                };
                return () => socketRef.current.close();
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        try {
            if (receiverid) {
                setLoading(true)
                setMessages([])
                console.log('initail Loading',loading)
                fetchData();
                callWebsocket();
                
            }
        } catch (err) {
            setError(err)
            setLoading(false)
        }

    }, [roomName, receiverid]);

    const sendMessage = () => {
        const recieverName = recieverData.username || recieverData.email.split('@')[0];
        const payload = {
            message,
            senderName,
            senderId,
            recieverName,
            receiverId,
        };
        socketRef.current.send(JSON.stringify(payload));
        setMessage('');
    };

    return (
        <div className='flex gap-4'>
            <div className='bg-gradient-to-tl from-stone-800 to-black h-screen w-1/3 py-12 overflow-y-auto'>
                <header className="flex items-center justify-between px-4 py-2 border-b">
                    <h1 className="text-lg font-semibold">Chat Room</h1>

                </header>
                <ChatList />

            </div>

            <div className="flex-1 flex flex-col h-screen py-12 bg-gradient-to-tl from-stone-800 to-black">
                {receiverid ?
                    (loading ?
                        (<ChatShimmer/>)
                        : (
                            <>
                                <header className="flex items-center justify-between px-4 py-2 border-b">
                                    <h1 className="text-lg font-semibold">{recieverData?.username}</h1>
                                    <Link to='/'>
                                        <Button variant="outline" size="sm">
                                            Leave Chat
                                        </Button>
                                    </Link>
                                </header>
                                <main className="flex-1 overflow-y-auto  p-4 space-y-4">
                                    {messages.map((msg, index) => (
                                        msg.user_id === receiverId ? (
                                            <div key={index} className="flex items-end space-x-2">
                                                <Avatar>
                                                    <AvatarImage src="/placeholder-user.jpg" alt={msg.username} />
                                                    <AvatarFallback>{msg.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                                        <p className="text-sm text-black">{msg.message}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div key={index} className="flex items-end justify-end space-x-2">
                                                <div>
                                                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                                                        <p className="text-sm">{msg.message}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">{formatDate(msg.timestamp)}</p>
                                                </div>
                                                
                                                <Avatar>
                                                    <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                            </div>
                                        )
                                    )
                                    )
                                    }
                                </main>
                                <footer className="flex items-center space-x-2 p-2 border-t">
                                    <Input className="flex-1" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    <Button variant="outline" size="sm" onClick={sendMessage}>
                                        Send
                                    </Button>
                                </footer>
                            </>)
                    )
                    :
                    (<div className='flex-1 flex justify-center items-center'>
                        <MessageCircle className='w-9 h-9' />
                        <h1>Message</h1>
                    </div>)}
            </div>
        </div>
    );
};

export default Chat;
