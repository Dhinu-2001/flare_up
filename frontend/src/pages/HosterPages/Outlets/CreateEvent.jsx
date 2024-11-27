"use client"

import React, { useEffect, useState, useContext } from 'react'
import { DataContext } from '@/ContextFiles/DataProvider'
import { Card } from '@/components/ui/card'
import AddMember from '@/Page_components/Common/AddMember'
import BannerVideoInput from '@/Page_components/Common/BannerVideoInput'
import MapPicker from '@/Page_components/Common/MapPicker'
import Title from '@/Page_components/CreateEventComponents/Title'
import DateTime from '@/Page_components/CreateEventComponents/DateTime'
import TicketInfo from '@/Page_components/CreateEventComponents/TicketInfo'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { parse, isValid } from 'date-fns';
import LocationDetail from '@/Page_components/CreateEventComponents/LocationDetail'
import axiosInstance from '@/axiosconfig'
import EventBannerUploadCloudinary from '@/Page_components/CloudinaryComponents/EventBannerUploadCloudinary'
import PromoVideoUploadCloudinary from '@/Page_components/CloudinaryComponents/PromoVideoUploadCloudinary'
import { store } from "../../../redux/Store";
import exceptions from '@mapbox/mapbox-gl-geocoder/lib/exceptions'
import { setError, setLoading } from '@/redux/auth/authSlice'
import { toast } from 'sonner'
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

function CreateEvent() {
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

  if (!data) {
    return <div>Loading...</div>
  }

  console.log('cat and type',data)
  // useEffect(() => {
  //   const fetchTypesAndCategories = async () => {
  //     try {
  //       const response = await axiosInstance.get('/events/event-types-and-categories/')

  //       const data = response.data
  //       console.log('data', data);

  //       setCategoriesTypesData(data)
  //       // setTypesData(response.data.types)
  //       console.log('Updated categoriesTypesData:', categoriesTypesData);

  //     } catch (error) {
  //       console.log(error)
  //       setError(error)
  //     } finally {
  //       // setLoading()
  //     }
  //   }
  //   fetchTypesAndCategories();
  // }, []);

  


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
    
    console.log(data)

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

    console.log(data)

    try {
      const response = await axiosInstance.post('/events/', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('Event creation successful:', response.data)
      reset();
      toast.success('Event created successfully')
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
    } catch (error) {
      console.log('Event creation failed:', error)
      toast.error('Event creation failed')
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
            {isSubmitting ? "Creating..." : "Create Event"}
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

export default CreateEvent
