import { PaymentColumns } from "@/components/DataTable/PaymentColumns";
import { DataTable } from '../../../components/DataTable/Data-Table';
import { PaymentsByHosterDataContext } from "@/ContextFiles/PaymentsByHosterDataProvider";
import { useContext } from "react";

export default function PaymentList() {
    const { data, error, loading } = useContext(PaymentsByHosterDataContext)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error loading data</p>
    console.log('actual event data', data)


    return (
        <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold">
                Payments
            </h3>
            <div className="container mx-auto pt-0 py-10">
                <DataTable columns={PaymentColumns} data={data} />
            </div>
        </div>
    );
}
