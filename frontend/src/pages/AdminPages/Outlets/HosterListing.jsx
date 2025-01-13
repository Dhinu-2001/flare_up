import { UserTableColumn } from '@/components/DataTable/UserTableColumn'
import React from 'react'
import { useContext } from "react";
import EventListShimmer from "@/components/Shimmer/EventList";
import { HosterListDataContext } from '@/ContextFiles/HosterListDataContext';
import { UserTable } from '@/components/DataTable/User-Table';


function HosterListing() {
    const {data, error, loading} = useContext(HosterListDataContext)

    if(loading) return <EventListShimmer/>
    if(error) return <p>Error loading data</p>
    console.log('actual event data',data)


  return (
    <div>
      <h3 className="text-white text-2xl md:text-3xl font-bold">
        Events
      </h3>
      <div className="container mx-auto pt-0 py-10">
        <UserTable columns={UserTableColumn} data={data} />
      </div>
    </div>
  );
}

export default HosterListing
