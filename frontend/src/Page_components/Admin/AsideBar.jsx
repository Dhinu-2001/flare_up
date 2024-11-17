import React from 'react'
import { useState, useEffect } from 'react'
import { Package, CreditCard, Languages, LogIn, UserPlus, Menu, Home, Calendar,Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom';

function AsideBar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeNav, setActiveNav] = useState(null)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true)
            } else {
                setSidebarOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (

        <aside className={`fixed left-0 top-0 pt-16 w-64 h-full bg-gradient-to-tl from-stone-800 to-black border-r p-4 transition-transform duration-300 ease-in-out z-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

            <nav className="space-y-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-cyan-400"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <Link to="/admin/dashboard">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'dashboard' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('dashboard')}
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Admin Dashboard
                    </Button>
                </Link>

                <Link to="/admin/events">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'Events' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('Events')}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Events
                    </Button>
                </Link>

                <Link to="/admin/payment_list">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'billing' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('billing')}
                    >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Billing
                    </Button>
                </Link>

                <Link to="#">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'Hosters' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('Hosters')}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Hosters
                    </Button>
                </Link>

                <Link to="#">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'Attendees' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('Attendees')}
                    >
                        <Languages className="mr-2 h-4 w-4" />
                        Attendees
                    </Button>
                </Link>

                <Link to="/admin/catgories">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'Manage site' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('Manage site')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Categories
                    </Button>
                </Link>
            </nav>

            <div className="mt-8">
                <h2 className="text-xs font-semibold text-gray-500 mb-4">ACCOUNT PAGES</h2>
                <nav className="space-y-2">
                    <Link to="/admin/profile">
                        <Button
                            variant="ghost"
                            className={`w-full justify-start ${activeNav === 'profile' ? 'bg-blue-500' : ''}`}
                            onClick={() => setActiveNav('profile')}
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                    </Link>
                    {/* <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'signIn' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('signIn')}
                    >
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                    </Button>
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeNav === 'signUp' ? 'bg-blue-500' : ''}`}
                        onClick={() => setActiveNav('signUp')}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                    </Button> */}
                </nav>
            </div>
        </aside>
    )
}

export default AsideBar
