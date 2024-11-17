import React, { useContext } from 'react'
import CardComponent from '@/Page_components/Common/CardComponent'
import MapComponent from '@/Page_components/Common/MapComponent'
import { EventsDataContext } from "@/ContextFiles/EventsDataProvider";
import HomePageEventDetails from '@/Page_components/UserSideComponents/HomePageEventDetails'


function Home() {
  const { data, error, loading } = useContext(EventsDataContext)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error loading data</p>

  console.log('actual event data',data)

  return (
    <>
      <video
        autoPlay
        loop
        muted
        className='absolute inset-0 w-full h-full object-cover '
      >
        <source src='https://eventconcept.com/wp-content/uploads/2024/03/EC_SplashPage_FD_1920x1080_v009-1.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      <main className="relative pt-20 flex-1  overflow-auto ">
        <HomePageEventDetails />
        <section className="p-10 bg-black h-[600px]">
          <MapComponent mapEvent={data} />
        </section>
        <section className='bg-slate-50 '>
          <div className='pt-16 pb-24  text-center flex flex-col items-center'>
            <h1 className="text-5xl font-bold text-sky-500 pb-9">Creative Event Agency</h1>
            <p className="text-xl md:text-2xl font-bold max-w-4xl text-stone-800 pb-5">
              The coolest startup family reunion in Europe that brings together over 4500 founders and investors.
            </p>
            <p className="text-xl md:text-2xl font-bold max-w-4xl text-stone-800">
              The coolest startup family reunion in Europe that brings.
            </p>
          </div>
        </section>
        <section className="p-10 px-40 bg-gradient-to-tl from-stone-800 to-black">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">Hot Upcoming Concerts</h2>
          <CardComponent />
        </section>
      </main>
    </>
  )
}

export default Home
