import { useContext } from "react";
import { AdminEventColumns } from "../../../components/DataTable/AdminEventColumns"
import { DataTable } from '../../../components/DataTable/Data-Table';
import { EventsDataContext } from "@/ContextFiles/EventsDataProvider";
import EventListShimmer from "@/components/Shimmer/EventList";

export default function EventList() {
    const {data, error, loading} = useContext(EventsDataContext)

    if(loading) return <EventListShimmer/>
    if(error) return <p>Error loading data</p>
    console.log('actual event data',data)


  return (
    <div>
      <h3 className="text-white text-2xl md:text-3xl font-bold">
        Events
      </h3>
      <div className="container mx-auto pt-0 py-10">
        <DataTable columns={AdminEventColumns} data={data} />
      </div>
    </div>
  );
}
