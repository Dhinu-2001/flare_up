import React, { useEffect, useState } from 'react'
import { store } from '@/redux/Store';
import { Card, CardContent } from '@/components/ui/card';

import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { env } from "@/utils/env";

import { getConfig } from '../../config';
let { VITE_notification_svc } = getConfig();

VITE_notification_svc = VITE_notification_svc || env.VITE_notification_svc

const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return format(date, "MMMM do, yyyy 'at' h:mm a");
};

function ChatList() {
    const socketRef = React.useRef(null);
    const state = store.getState()
    const user_id = state.id
    const [chatList, setChatList] = useState([]);
    const navigate = useNavigate()

    const handleNavigate = (chat) =>{
        const recieverId = chat.room.user1 === user_id ? chat.room.user2 : chat.room.user1
        navigate(`/chat/${recieverId}`)
    }

    useEffect(() => {
        // Connect to WebSocket
        socketRef.current = new WebSocket(`ws://${VITE_notification_svc}/ws/chat-list/${user_id}/`);

        // Handle incoming messages
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setChatList((prev) => {
                const prevChats = prev.filter(
                    (chat) => chat.room.id !== data.room.id
                );
                return [...prevChats];
            });
            setChatList((prev) => [data, ...prev]);
            console.log('chatList', chatList)
        };
        return () => socketRef.current.close();

    }, [])


    return (
        <div className="space-y-4 gap-3 p-3 ">
            {chatList.map((chat, index) => (
                // <Link to={`/chat/${}`}>
                    <Card key={index} onClick={()=>handleNavigate(chat)} >
                        <CardContent className="flex items-center p-2">
                            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                                <img alt={''} className="w-full h-full object-cover" />
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    <h3 className="font-semibold">
                                        {chat.room.user1 === user_id ?
                                            chat.room.user2_name
                                            :
                                            chat.room.user1_name}
                                    </h3>
                                    <p className="text-sm text-gray-500">{formatDate(chat.message.timestamp)}</p>
                                    <h3 className="font-semibold">{chat.message.content}</h3>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                // </Link>
            ))}
        </div>
    )
}

export default ChatList
