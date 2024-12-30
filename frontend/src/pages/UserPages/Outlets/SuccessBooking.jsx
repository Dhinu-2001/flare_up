import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/axiosconfig";

export default function SuccessBooking() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [ticketUrl, setTicketUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const paymentDetails = useMemo(
    () => ({
      transaction_id: searchParams.get("transaction_id"),
      amount_received: searchParams.get("amount_received"),
      event_id: searchParams.get("event_id"),
      user_id: searchParams.get("user_id"),
      quantity: searchParams.get("quantity"),
    }),
    [searchParams]
  );

  const orderDetails = {
    orderId: "ORD-12345",
    amount: "$99.99",
    date: new Date().toLocaleDateString(),
  };

  const fetchData = async (event_id) => {
    try {
      const response = await axiosInstance.get(`/events/event/${event_id}/`);
      console.log("context", response);
      setData(response.data);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchTicket = async (transaction_id) => {
    try {
      const response = await axiosInstance.get(
        `/events/ticket-download/${transaction_id}/`
      );
      console.log("secure_url", response.data);
      setTicketUrl(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentDetails.event_id) {
      setLoading(true);
      fetchData(paymentDetails.event_id);
      fetchTicket(paymentDetails.transaction_id);
    }
  }, [paymentDetails.event_id]);

  if (loading) return <BookingResultShimmer/>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full sm:w-3/4 md:w-2/4 rounded-none">
          <CardHeader>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl font-bold text-green-500">
                Payment Successful
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Thank you for booking the tickets. Your tickets has been
              successfully processed.
            </p>
            <div className="bg-zinc-800 p-4 rounded-none">
              <h3 className="font-semibold text-lg mb-2">Order Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">
                    {" "}
                    {paymentDetails.transaction_id}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">
                    {paymentDetails.amount_received}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{orderDetails.date}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Event title:</span>
                  <span className="font-medium">{data?.event_data?.title}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">No. of tickets:</span>
                  <span className="font-medium">{paymentDetails.quantity}</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-3">
            <Link to="/">
              <Button type="button" className="w-full sm:w-auto rounded-none">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>

            <a href={ticketUrl.secure_url} download={ticketUrl.public_id}>
              <Button type="button" className="w-full sm:w-auto rounded-none">
              <Download className="mr-2 h-4 w-4" />
                Download Ticket
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

// <video
//     autoPlay
//     loop
//     muted
//     className='absolute inset-0 w-full h-full object-cover '
// >
//     <source src={`https://res.cloudinary.com/dzwjm8n8v/video/upload/v1731568818/${data.event_data.promo_video}.mp4`} />
//     Your browser does not support the video tag.
// </video>
