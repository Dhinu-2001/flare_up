import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '@/axiosconfig'





export default function CaseStudies() {
    const [selectedType, setSelectedType] = useState("All");
    const [sortOrder, setSortOrder] = useState("A to Z");
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [types, setTypes] = useState(["All"]);
    const { category_name } = useParams();
    const [eventsData, setEventsData] = useState(null);

    if (!category_name) return <p>Error no category.</p>;

    useEffect(() => {
        const fetchEventsByCategory = async () => {
            try {
                const response = await axiosInstance.get(`events/events/category/${category_name}/`);
                console.log(response.data);
                setEventsData(response.data);
                if (response.data?.category_data?.[0]?.event_types) {
                    const eventType = response.data?.category_data?.[0]?.event_types.map((eventType) => eventType.name);
                    setTypes(["All", ...new Set(eventTypes)]);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchEventsByCategory();
    }, [category_name]);

    if (!eventsData) return <p>Loading...</p>;

    console.log('types of category', types);

    // Filter and sort events
    const filteredAndSortedEvents = eventsData.event_data
        .filter(event => 
            (selectedType === "All" || event.type === selectedType) &&
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) // Search filter
        )
        .sort((a, b) => {
            if (sortOrder === "A to Z") {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

    return (
        <div className="min-h-screen bg-black py-20 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00ffcc] mb-8">
                    Specialists in the truly special
                </h2>

                <p className="text-white/90 text-lg md:text-xl max-w-3xl mb-16 leading-relaxed">
                    Our close-knit team of over 100 thinkers, doers, organisers and makers work in harmony with you,
                    and each other, to deliver the desired result. A unique set of skills that combine the best of
                    creative agency thinking and production company doing in one seamless process.
                </p>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <Select onValueChange={setSelectedType} defaultValue={selectedType}>
                        <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white rounded-none">
                            <SelectValue placeholder="Event Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            {types.map((type) => (
                                <SelectItem key={type} value={type} className="text-white hover:bg-zinc-800">
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
                        <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white rounded-none">
                            <SelectValue placeholder="Sort A to Z" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="A to Z" className="text-white hover:bg-zinc-800">A to Z</SelectItem>
                            <SelectItem value="Z to A" className="text-white hover:bg-zinc-800">Z to A</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Search Input */}
                    <div className="flex">
                        <Input
                            className="bg-zinc-900 border-zinc-800 text-white rounded-none"
                            placeholder="Search"
                            type="search"
                            value={searchTerm} // Bind search input to state
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        />
                        <Button size="icon" variant="ghost" className="bg-emerald-400 hover:bg-emerald-500 rounded-none">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAndSortedEvents.map((event) => (
                        <div key={event.id} className="relative group overflow-hidden rounded-lg">
                            <img
                                src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${event.banner_image}.jpg`}
                                alt={event.title}
                                width={800}
                                height={600}
                                className="object-cover w-full h-[400px] transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <span className="text-[#00ffcc] text-sm font-medium">{event.type}</span>
                                <div>
                                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">{event.title}</h3>
                                    <Link to={`/catgory/${event.category}/${event.type}/${event.id}/`}>
                                        <Button
                                            variant="outline"
                                            className="rounded-none bg-[#00ffcc] text-black border-none hover:bg-[#00ffcc]/90 transition-colors"
                                        >
                                            VIEW EVENT DETAILS
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}