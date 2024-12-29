import { HosterEventColumns } from "../../../components/DataTable/HosterEventColumns"
import { DataTable } from '../../../components/DataTable/Data-Table';
import { useContext } from "react";
import { EventsByHosterDataContext } from "@/ContextFiles/EventsByHosterDataProvider";

export default function EventList() {
  
  const {data, error, loading} = useContext(EventsByHosterDataContext)

  if(loading) return <p>Loading...</p>
    if(error) return <p>Error loading data</p>
    console.log('actual event data',data)


  return (
    <div>
      <h3 className="text-white text-2xl md:text-3xl font-bold">
        Events
      </h3>
      <div className="container mx-auto pt-0 py-10">
        <DataTable columns={HosterEventColumns} data={data} />
      </div>
    </div>
  );
}
