import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { store } from '../../../redux/Store'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

const Chat = () => {
    const { reciever_id } = useParams();
    const receiverId = Number(reciever_id);

    const state = store.getState()
    const senderId = state.id
    const username = state.username ? state.username : 'User';

    const room_array = [senderId, receiverId];
    room_array.sort((a, b) => a - b);

    const roomName = `chat_${room_array[0]}-${room_array[1]}`
    console.log('roomName', roomName)

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socketRef = React.useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        socketRef.current = new WebSocket(`ws://localhost:8084/ws/chat/${roomName}/`);

        // Handle incoming messages
        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        // Clean up on component unmount
        return () => socketRef.current.close();
    }, [roomName]);

    const sendMessage = () => {
        const payload = {
            message,
            username,
            senderId,
            receiverId,
        };
        socketRef.current.send(JSON.stringify(payload));
        setMessage('');
    };

    return (
        // <div className='flex justify-center items-center h-screen '>
        //     <h2>Chat Room: {roomName}</h2>
        //     <div>
        //         {messages.map((msg, index) => (
        //             <div key={index}>
        //                 <strong>{msg.username}</strong>: {msg.message}
        //             </div>
        //         ))}
        //     </div>
        //     <input
        //         className='text-black'
        //         type="text"
        //         value={message}
        //         onChange={(e) => setMessage(e.target.value)}
        //         placeholder="Type a message..."
        //     />
        //     <button onClick={sendMessage}>Send</button>
        // </div>
        <div className="flex flex-col h-screen py-12">
            <header className="flex items-center justify-between px-4 py-2 border-b">
                <h1 className="text-lg font-semibold">Chat Room</h1>
                <Button variant="outline" size="sm">
                    Leave Chat
                </Button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                msg.user_id === receiverId ? (
                    <div key={index} className="flex items-end space-x-2">
                        <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" alt={msg.username} />
                            <AvatarFallback>{msg.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <p className="text-sm text-black">{msg.message}</p>
                        </div>
                    </div>
                ) : (
                    <div key={index} className="flex items-end justify-end space-x-2">
                        <div className="p-2 rounded-lg bg-blue-500 text-white">
                            <p className="text-sm">{msg.message}</p>
                        </div>
                        <Avatar>
                            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                )
            ))}
        </main>
            <footer className="flex items-center space-x-2 p-2 border-t">
                <Input className="flex-1" placeholder="Type a message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button variant="outline" size="sm" onClick={sendMessage}>
                    Send
                </Button>
            </footer>
        </div>
    );
};

export default Chat;
