"use client"

import React, { useEffect, useState, useContext } from 'react'
import { DataContext } from '@/ContextFiles/DataProvider'
import { Card } from '@/components/ui/card'
import MapPicker from '@/Page_components/Common/MapPicker'
import Title from '@/Page_components/CreateEventComponents/Title'
import DateTime from '@/Page_components/CreateEventComponents/DateTime'
import TicketInfo from '@/Page_components/CreateEventComponents/TicketInfo'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { parseISO, format, isValid } from 'date-fns';
import LocationDetail from '@/Page_components/CreateEventComponents/LocationDetail'
import axiosInstance from '@/axiosconfig'
import EventBannerUploadCloudinary from '@/Page_components/CloudinaryComponents/EventBannerUploadCloudinary'
import PromoVideoUploadCloudinary from '@/Page_components/CloudinaryComponents/PromoVideoUploadCloudinary'
import { store } from "../../../redux/Store";
import exceptions from '@mapbox/mapbox-gl-geocoder/lib/exceptions'
import { setError, setLoading } from '@/redux/auth/authSlice'
import { toast } from 'sonner'
import { EventDetailsDataContext } from '@/ContextFiles/EventDetailsProvider'
import { useNavigate } from 'react-router-dom'
// Define the date-time format you expect: "PPP HH:mm:ss"
const dateTimeFormat = "yyyy-MM-dd HH:mm:ss";

// Helper function to parse and validate the date format
const parseDate = (value) => {
    const parsedDate = parse(value, dateTimeFormat, new Date());
    return isValid(parsedDate) ? parsedDate : null;
};


// .min(1, { message: 'Category is required' })
const schema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    // address: z.string().min(1, { message: 'Address is required' }),
    // city: z.string().min(1, { message: 'City is required' }),
    // state: z.string().min(1, { message: 'State is required' }),
    // country: z.string().min(1, { message: 'Countr y is required' }),

    payment_required: z.boolean(),
    ticket_price: z.union([z.string(), z.number()]).optional(),
    participant_capacity: z.number({
        required_error: 'Ticket capacity is required',
        invalid_type_error: 'Ticket capacity must be a number',
    })
        .min(1, 'Ticket capacity must be greater than 0')
});

function EditEvent() {
    const navigate = useNavigate()

    const { data: event_data, loading: event_loading, error: event_error, refreshData: event_refreshData, setLoading: event_setLoading } = useContext(EventDetailsDataContext)
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm({
        resolver: zodResolver(schema)
    })
    const { data, loading, error } = useContext(DataContext)
    const [availableTypes, setAvailableTypes] = useState(null)
    const [categoriesTypesData, setCategoriesTypesData] = useState(null);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [bannerPublicId, setBannerPublicId] = useState("");
    const [videoPublicId, setVideoPublicId] = useState("");
    const [startdatetime, setStartdatetime] = useState();
    const [enddatetime, setEnddatetime] = useState();
    const [registrationDeadline, setRegistrationDeadline] = useState()
    const [regAmountChecked, setRegAmountChecked] = useState(false)
    // const [keyParticipants, setKeyParticipants] = useState([])
    // const [sponsers, setSponsers] = useState([])
    const [lng, setLng] = useState(-70.9);
    const [lat, setLat] = useState(42.35);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const reduxState = store.getState()

    useEffect(() => {
        if (event_data) {
            const event_details = event_data.event_data
            console.log('useefffect', typeof event_details.category)
            setValue("title", event_details.title || "");
            setValue("description", event_details.description || "");
            setValue("payment_required", event_details.payment_required || "");
            setValue("ticket_price", event_details.ticket_price || "");
            setValue("participant_capacity", event_details.participant_capacity || "");
            const current_cate = data?.find((cate) => cate.name === event_details.category)
            console.log('current_cate', current_cate)
            setCategory(current_cate.id.toString())
            setAvailableTypes(current_cate.event_types)
            setType(availableTypes?.find((typ) => typ.name === event_details.type)?.id.toString())

            // const parsedDate = parse(event_details.start_date_time, "yyyy-MM-dd HH:mm:ss", new Date());
            const startdatetime = event_details.start_date_time;
            const isoStartDateTime = startdatetime.replace(" ", "T");
            const parsedstartDate = new Date(isoStartDateTime);
            setStartdatetime(parsedstartDate)

            const enddatetime = event_details.end_date_time;
            const isoEndDateTime = enddatetime.replace(" ", "T");
            const parsedendDate = new Date(isoEndDateTime);
            setEnddatetime(parsedendDate)

            const registrationdatetime = event_details.registration_deadline;
            const isoregistrationDateTime = registrationdatetime.replace(" ", "T");
            const parsedregistrationDate = new Date(isoregistrationDateTime);
            setRegistrationDeadline(parsedregistrationDate)

            setLng(event_details.longitude)
            setLat(event_details.latitude)

            if(event_details.payment_required){
                setRegAmountChecked(true)
            }

            setAddress(event_details.address_line_1)
            setCity(event_details.city)
            setState(event_details.state)
            setCountry(event_details.country)

            setBannerPublicId(event_details.banner_image)
            setVideoPublicId(event_details.promo_video)
        }
    }, [setValue, event_data])

    if (!data) {
        return <div>Loading...</div>
    }

    console.log('cat and type', data)
    console.log('event_data', event_data)


    const handleRegistrationMode = (value) => {
        if (value == 'free') {
            setRegAmountChecked(false)
            setValue('payment_required', false)
        } else if (value == 'paid') {
            setRegAmountChecked(true)
            setValue('payment_required', true)
        }
    }



    const onSubmit = async (data) => {

        

        data.host_id = reduxState.id;
        data.category = parseInt(category);
        data.type = parseInt(type);
        data.start_date_time = startdatetime.toISOString();
        data.end_date_time = enddatetime.toISOString();
        data.registration_deadline = registrationDeadline.toISOString();
        data.banner_image = bannerPublicId
        data.promo_video = videoPublicId
        data.longitude = lng
        data.latitude = lat
        data.address_line_1 = address
        data.city = city
        data.state = state
        data.country = country

        console.log('submitted data',data)

        try {
            const response = await axiosInstance.put(`/events/event/${event_data.event_data.id}/`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log('Event edited successful:', response.data)
            reset();
            toast.success('Event edited successfully')
            setCategory('')
            setType('')
            setBannerPublicId('')
            setVideoPublicId('')
            setStartdatetime()
            setEnddatetime()
            setRegistrationDeadline()
            setRegAmountChecked(false)
            setAddress('')
            setCity('')
            setState('')
            setCountry('')

            navigate(`/hoster/events/event/${event_data.event_data.id}`)
        } catch (error) {
            console.log('Event editing failed:', error)
            toast.error('Event editing failed')
        }
    }

    return (
        <div className='w-full overflow-y-auto mb-16 '>

            <form onSubmit={handleSubmit(onSubmit)} >
                <div className="w-full  bg-stone-900 text-gray-100 p-8 pb-0 flex flex-wrap justify-center items-start gap-4 overflow-y-auto">
                    <Title availableTypes={availableTypes} setAvailableTypes={setAvailableTypes} createEvent={register} errors={errors} category={category} type={type} setCategory={setCategory} setType={setType} categoriesTypesData={data} />
                    <Card className="min-w-72 max-w-screen-md h-full flex-1 bg-gray-800 text-gray-100 ">

                        <TicketInfo createEvent={register} errors={errors} regAmountChecked={regAmountChecked} handleRegistrationMode={handleRegistrationMode} registrationDeadline={registrationDeadline} setRegistrationDeadline={setRegistrationDeadline} enddatetime={enddatetime} />
                    </Card>
                </div>

                <div className="w-full p-8 py-4 bg-stone-900 text-gray-100  flex flex-wrap justify-center items-start gap-4 ">
                    <DateTime createEvent={register} errors={errors} startdatetime={startdatetime} setStartdatetime={setStartdatetime} enddatetime={enddatetime} setEnddatetime={setEnddatetime} address={address} setAddress={setAddress} city={city} setCity={setCity} state={state} setState={setState} country={country} setCountry={setCountry} />
                    <MapPicker lng={lng} setLng={setLng} lat={lat} setLat={setLat} address={address} setAddress={setAddress} city={city} setCity={setCity} state={state} setState={setState} country={country} setCountry={setCountry} />
                </div>
                {/* 
        <div className='p-8 py-4 text-gray-100 flex items-start gap-4 '>
          <AddMember list={keyParticipants} setList={setKeyParticipants} title="key participants" list_title="key participant list:" designation role />
          <AddMember list={sponsers} setList={setSponsers} title="Add Sponsers" list_title="Sponser list:" />
        </div> */}

                <div className='w-full p-8 py-4 flex flex-wrap justify-center items-start gap-4'>
                    <PromoVideoUploadCloudinary publicId={videoPublicId} setPublicId={setVideoPublicId} />
                    <EventBannerUploadCloudinary publicId={bannerPublicId} setPublicId={setBannerPublicId} />

                </div>
                <div className='flex justify-center m-4'>
                    <Button disabled={isSubmitting} type="submit" className="w-32">
                        {isSubmitting ? "Edits updating..." : "Save Edit"}
                    </Button>
                    {/* <Button type="submit" className="w-32">
            Create Event
          </Button> */}
                    {errors.root && (
                        <div className="text-red-500">{errors.password.message}</div>
                    )}
                </div>

            </form>
        </div>
    )
}

export default EditEvent
