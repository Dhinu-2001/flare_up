import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from 'react-redux';
import { clearAuthData } from '@/redux/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '@/axiosconfig';
import NotificationMenu from '@/Page_components/Common/NotificationMenu';
import { MessageCircle } from 'lucide-react';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  let content;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authenticateStateValue = useSelector((store) => store.isAuthenticated)
  const roleValue = useSelector((store) => store.role)

  useEffect(() => {
    setIsAuthenticated(authenticateStateValue)
    setRole(roleValue)
  }, [authenticateStateValue, roleValue])

  console.log(authenticateStateValue)
  console.log(roleValue)

  const logout = async () => {
    try {
      const response = await axiosInstance.post('/logout/', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log(response)

      dispatch(clearAuthData())
      navigate('/login')
    } catch (error) {
      console.log('logout failed:', error)
    }

  }

  if (role === 'user') {
    content = (
      <>
        <Link to="/categories">
          <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">Discover</Button>
        </Link>

        <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">My Tickets</Button>
      </>
    )
  }
  // else if (role === 'hoster') {
  //   content = (
  //     <>
  //       <Link to="/hoster/create_event">
  //         <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">Create new Event</Button>
  //       </Link>
  //       <Link to="/hoster/create_event">
  //         <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">My Events</Button>
  //       </Link>
  //       <Link to="/hoster/create_event">
  //         <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">About us</Button>
  //       </Link>
  //     </>
  //   )
  // } else {
  //   content = (
  //     <>
  //       <Link to="/categories">
  //         <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">Discover</Button>
  //       </Link>

  //       <Button variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-gray-700">My Tickets</Button>
  //     </>
  //   )
  // }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 py-4 px-6 flex justify-between items-center ">
        <h1 className="text-3xl font-bold text-blue-400">MeetMingle</h1>

        <div>
          {content}
        </div>

        <nav>

          {isAuthenticated ?
            (
              <div className='flex items-center gap-5 pr-2'>
                <Link to='/chat'>
                  <Button
                    variant="outline"
                    size="icon"
                    className=
                    " bg-sky-500 border-white hover:bg-sky-300  h-8 w-8 rounded-full"

                  >
                    <MessageCircle className="h-8 w-8 transition-transform" />
                  </Button>
                </Link>

                <NotificationMenu />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="  text-blue-400  bg-sky-500 border-white hover:bg-sky-300  h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Setting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) :
            (
              <div>
                <Link to='/login'>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-400 hover:bg-gray-700">Sign in</Button>
                </Link>

                <Link to='/register'>
                  <Button variant="ghost" className="text-blue-400 hover:text-blue-400 hover:bg-gray-700">Sign up</Button>
                </Link>
              </div>
            )
          }
        </nav>
      </header>
    </>
  )
}

export default Header
