import { ParticipantsColumn } from "@/components/DataTable/ParticipantsColumn";
import { DataTable } from "@/components/DataTable/Data-Table"; 
import { PaymentsByEventDataContext } from "@/ContextFiles/PaymentsByEventDataProvider";
import { useContext } from "react";

export default function ParticipantList() {
    const { data, error, loading } = useContext(PaymentsByEventDataContext)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>
    console.log('actual event data', data)


    return (
        <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold">
                Payments
            </h3>
            <div className="container mx-auto pt-0 py-10">
                <DataTable columns={ParticipantsColumn} data={data} />
            </div>
        </div>
    );
}
