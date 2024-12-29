import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Clock, CalendarIcon } from 'lucide-react'
import React, { useState } from 'react'
import { TimePickerDemo } from '@/components/time-picker/time-picker'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

function DateTime({ startdatetime, setStartdatetime, enddatetime, setEnddatetime, address, setAddress, city, setCity, state, setState, country, setCountry }) {
    // const [date, setDate] = useState()
    const [startDateError, setStartDateError] = useState("");
    const [endDateError, setEndDateError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleStartDateSelect = (selectedDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            console.log('start date',selectedDate)
            setStartDateError("Please select a date that is not in the past.");
            setShowError(true);
            setStartdatetime();

            setTimeout(() => {
                setShowError(false);
                setTimeout(() => setStartDateError(""), 500);
            }, 2000);
        } else {
            setStartDateError("");
            setShowError(false);
            setStartdatetime(selectedDate);
        }
    };

    const handleEndDateSelect = (selectedDate) => {
        const today = new Date();
        // Reset time to midnight to compare just the date part
        today.setHours(0, 0, 0, 0);

        if (!startdatetime) {
            setEndDateError("Please select a start date.");
            setShowError(true);
            setEnddatetime();

            setTimeout(() => {
                setShowError(false);
                setTimeout(() => setEndDateError(""), 500);
            }, 2000);
        } else if (selectedDate < startdatetime) {
            setEndDateError("Please select a date that is not in the past to start date.");
            setShowError(true);
            setEnddatetime();

            setTimeout(() => {
                setShowError(false);
                setTimeout(() => setEndDateError(""), 500);
            }, 2000);
        }
        else {
            setEndDateError(""); // Clear error if date is valid
            setShowError(false);
            setEnddatetime(selectedDate);
        }
    };

    return (
        <Card className="min-w-72    flex-1 bg-black text-gray-100 ">
            <CardHeader className="flex flex-col items-start justify-between">
                <div className="flex items-center">
                    <Clock className="w-6 h-6 text-white mr-2" />
                    <CardTitle>Date and Time</CardTitle>
                </div>
                <div className="flex items-center">
                    <p className="text-sm mb-4">Enter the time of event.</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className='flex-1 flex-col'>
                        <div className='flex flex-col items-start'>
                            <label htmlFor="email" className="text-sm font-medium">
                                Choose starting date and time
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !startdatetime && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startdatetime ? format(startdatetime, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startdatetime}
                                        onSelect={handleStartDateSelect}
                                        initialFocus
                                    />
                                    <div className='p-3 border-t border-border'>
                                        <TimePickerDemo setDate={setStartdatetime} date={startdatetime} />
                                    </div>
                                </PopoverContent>
                                {startDateError && <p
                                    className={`text-red-500 mt-2 transition-opacity duration-500 ${showError ? "opacity-100" : "opacity-0"}`}
                                >{startDateError}</p>}
                            </Popover>
                        </div>

                        <div className='flex flex-col items-start mt-2'>
                            <label htmlFor="email" className="text-sm font-medium">
                                Choose ending date and time
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !enddatetime && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {enddatetime ? format(enddatetime, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={enddatetime}
                                        onSelect={handleEndDateSelect}
                                        initialFocus

                                    />
                                    <div className='p-3 border-t border-border'>
                                        <TimePickerDemo setDate={setEnddatetime} date={enddatetime} />
                                    </div>
                                </PopoverContent>
                                {endDateError && <p
                                    className={`text-red-500 mt-2 transition-opacity duration-500 ${showError ? "opacity-100" : "opacity-0"}`}
                                >{endDateError}</p>}
                            </Popover>
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium">
                                Address
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} id="description" type="description" placeholder="Event address" className=" bg-black border-gray-600 rounded-lg"
                            // {...createEvent("address")}
                            />
                            {/* {errors.description && <p>{errors.description.message}</p>} */}
                        </div>
                        <div className='grid md:grid-cols-2  gap-3'>
                            <div>
                                <label htmlFor="email" className="text-sm font-medium">
                                    City
                                    <span className="text-gray-400 text-xs ml-1">Required</span>
                                </label>
                                <Input value={city} onChange={(e) => setCity(e.target.value)} id="title" placeholder="Event city" className="bg-black border-gray-600 rounded-full"
                                // {...createEvent("city")}
                                />
                                {/* {errors.title && <p className='text-white'>{errors.title.message}</p>} */}
                            </div>
                            <div>
                                <label htmlFor="dob" className="text-sm font-medium">
                                    State
                                    <span className="text-gray-400 text-xs ml-1">Required</span>
                                </label>
                                <Input value={state} onChange={(e) => setState(e.target.value)} id="category" placeholder="Event State" className="bg-black border-gray-600 rounded-full"
                                // {...createEvent("state")}
                                />
                                {/* {errors.category && <p>{errors.category.message}</p>} */}
                            </div>
                            <div>
                                <label htmlFor="dob" className="text-sm font-medium">
                                    Country
                                    <span className="text-gray-400 text-xs ml-1">Required</span>
                                </label>
                                <Input value={country} onChange={(e) => setCountry(e.target.value)} id="category" placeholder="Event country" className="bg-black border-gray-600 rounded-full"
                                // {...createEvent("country")}
                                />
                                {/* {errors.category && <p>{errors.category.message}</p>} */}
                            </div>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}

export default DateTime
