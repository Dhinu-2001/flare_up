import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MessageCircle, X } from "lucide-react"

function AsideChatbox() {
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const users = [
        { id: 1, name: 'Alice', image: '/placeholder.svg?height=32&width=32' },
        { id: 2, name: 'Bob', image: '/placeholder.svg?height=32&width=32' },
        { id: 3, name: 'Charlie', image: '/placeholder.svg?height=32&width=32' },
    ]

    const openChat = (user) => {
        setSelectedUser(user)
        setIsChatOpen(true)
    }

    return (
        <>
            {/* Sidebar */}
            <div className='bg-stone-900 w-16 h-screen py-2' >
                <aside className="w-14 pt-10 m-2 mt-0 h-full rounded-lg bg-black flex flex-col items-center py-4 space-y-4">

                    {users.map((user) => (
                        <Avatar key={user.id} className="cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all" onClick={() => openChat(user)}>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                    ))}

                </aside>
            </div>
            {/* Chat Modal */}
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                <DialogContent className="bg-gray-800 text-white border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Avatar>
                                    <AvatarImage src={selectedUser?.image} alt={selectedUser?.name} />
                                    <AvatarFallback>{selectedUser?.name[0]}</AvatarFallback>
                                </Avatar>
                                <span>Chat with {selectedUser?.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[300px] border border-gray-700 rounded-md p-4 mb-4">
                        <div className="space-y-4">
                            <div className="bg-gray-700 p-2 rounded-lg max-w-[80%]">
                                <p className="text-sm">Hey! Are you going to the Neon Nights concert?</p>
                            </div>
                            <div className="bg-purple-600 p-2 rounded-lg max-w-[80%] ml-auto">
                                <p className="text-sm">Yes, I can't wait! Are you?</p>
                            </div>
                            <div className="bg-gray-700 p-2 rounded-lg max-w-[80%]">
                                <p className="text-sm">We should meet up there!</p>
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1 bg-gray-700 border-gray-600" />
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default AsideChatbox
