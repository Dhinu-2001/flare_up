import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Ticket, CalendarIcon } from 'lucide-react'
import React, {useState} from 'react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TimePickerDemo } from '@/components/time-picker/time-picker'
import { Calendar } from '@/components/ui/calendar'

function TicketInfo(props) {
    const [deadLineDateError, setDeadLineDateError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleStartDateSelect = (selectedDate) => {
        const enddatetime = props.enddatetime;

        if (!props.enddatetime){
            setDeadLineDateError("Please select end date below.");
            setShowError(true);
            props.setRegistrationDeadline();

            setTimeout(() => {
                setShowError(false);
                setTimeout(() => setDeadLineDateError(""), 500);
            }, 2000);
        }else if (selectedDate > enddatetime) {
            setDeadLineDateError("Please select a date that is before end date.");
            setShowError(true);
            props.setRegistrationDeadline();

            setTimeout(() => {
                setShowError(false);
                setTimeout(() => setDeadLineDateError(""), 500);
            }, 2000);
        } else {
            setDeadLineDateError("");
            setShowError(false);
            props.setRegistrationDeadline(selectedDate);
        }
    };

    return (
        <Card className="min-w-72  max-w-screen-md flex-1 bg-black text-gray-100 ">
            <CardHeader className="flex flex-col items-start justify-between">
                <div className="flex items-center">
                    <Ticket className="w-6 h-6 text-white mr-2" />
                    <CardTitle>Ticket and Registration Information</CardTitle>
                </div>
                <div className="flex items-center">
                    <p className="text-sm mb-4">Enter the details of event.</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div >

                        <label htmlFor="email" className="text-sm font-medium">
                            Ticket Type
                            <span className="text-gray-400 text-xs ml-1">Required</span>
                        </label>

                        <RadioGroup className='flex gap-9' defaultValue="option-one"
                            onValueChange={(value) => {
                                props.handleRegistrationMode(value); // Call any additional handler if needed
                            }}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="free" id="option-one" />
                                <Label htmlFor="option-one">Free registration</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paid" id="option-two"/>
                                <Label htmlFor="option-two">Payment for registration</Label>
                                {props.errors.payment_required && <p className='text-red-500'>{props.errors.payment_required.message}</p>}
                            </div>
                        </RadioGroup>

                    </div>

                    <div className='grid md:grid-cols-2  gap-3'>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium">
                                Ticket Amount
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Input
                                {...props.createEvent('ticket_price')}
                                disabled={!props.regAmountChecked} id="description" type="number" placeholder="Ticket Amount" className=" bg-black border-gray-600 rounded-full" />
                            {props.errors.ticket_price && <p className='text-red-500'>{props.errors.ticket_price.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium">
                                Total Ticket Count
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Input id="participant_capacity" type="number" placeholder="Total Ticket Count" className=" bg-black border-gray-600 rounded-full"
                                {...props.createEvent('participant_capacity', { valueAsNumber: true })}
                            />
                            {props.errors.participant_capacity && <p className='text-red-500'>{props.errors.participant_capacity.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="dob" className="text-sm font-medium">
                                Registration Deadline
                                <span className="text-gray-400 text-xs ml-1">Required</span>
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !props.registrationDeadline && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {props.registrationDeadline ? format(props.registrationDeadline, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={props.registrationDeadline}
                                        onSelect={handleStartDateSelect}
                                        initialFocus
                                    />
                                    <div className='p-3 border-t border-border'>
                                        <TimePickerDemo setDate={props.setRegistrationDeadline} date={props.registrationDeadline} />
                                    </div>
                                </PopoverContent>
                                {deadLineDateError && <p
                                    className={`text-red-500 mt-2 transition-opacity duration-500 ${showError ? "opacity-100" : "opacity-0"}`}
                                >{deadLineDateError}</p>}
                            </Popover>

                        </div>
                    </div>


                </div>

            </CardContent>
        </Card>
    )
}

export default TicketInfo
