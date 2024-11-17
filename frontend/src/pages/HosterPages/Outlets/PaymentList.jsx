import { AdminEventColumns } from "../../../components/DataTable/AdminEventColumns"
import { DataTable } from '../../../components/DataTable/Data-Table';

function getData() {
    // Mock data to simulate API data fetching
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "a273b54d",
            amount: 250,
            status: "completed",
            email: "john.doe@example.com",
        },
        {
            id: "93fhd27e",
            amount: 75,
            status: "failed",
            email: "jane.smith@example.com",
        },
        {
            id: "03bfe89a",
            amount: 300,
            status: "completed",
            email: "alice@example.com",
        },
        {
            id: "81nfh45g",
            amount: 150,
            status: "pending",
            email: "bob@example.com",
        },
        {
            id: "2hf9847c",
            amount: 90,
            status: "completed",
            email: "carol@example.com",
        },
    ];
}

export default function PaymentList() {
    const data = getData();

    return (
        <div>
            <h3 className="text-white text-2xl md:text-3xl font-bold">
                Payments
            </h3>
            <div className="container mx-auto pt-0 py-10">
                <DataTable columns={AdminEventColumns} data={data} />
            </div>
        </div>
    );
}