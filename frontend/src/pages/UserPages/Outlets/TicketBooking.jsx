import { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventDetailsDataContext } from "@/ContextFiles/EventDetailsProvider";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "@/axiosconfig";
import exceptions from "@mapbox/mapbox-gl-geocoder/lib/exceptions";
import { toast } from "sonner";
import { store } from "@/redux/Store";

const formSchema = z.object({
  quantity: z.number().min(1).max(10),
});

const ticketPrices = {
  standard: 50,
  vip: 100,
  premium: 150,
};

export default function TicketBooking() {
  const { data, loading, error, refreshData, setLoading } = useContext(
    EventDetailsDataContext
  );
  const [tickets, setTickets] = useState(1);
  const [total, setTotal] = useState(0);
  const state = store.getState();
  const user_id = state.id;
  const username = state.username;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  function onSubmit(values) {
    console.log(values);
    alert("Booking submitted! Check the console for details.");
  }

  const calculateTotal = (quantity) => {
    if (data.event_data.payment_required) {
      const price = data.event_data.ticket_price;
      return price * quantity;
    } else {
      return 0;
    }
  };

  const makePayment = async (e) => {
    e.preventDefault();
    try {
      console.log("button clikced");
      const stripe = await loadStripe(
        "pk_test_51QOwBVEoHTcQ6zGjLjuWXuhGMGa4bKAFjM3iwkcRMaEMzq1GSBFuSx1o1Llv0sZbFFMczTlY2j5p6mLwtOqxD5aH0056InV0d3"
      );
      const payment_data = {
        user_id: user_id,
        username: username,
        event_id: data.event_data.id,
        hoster_id: data.user_data.id,
        title: data.event_data.title,
        banner: `https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${data.event_data.banner_image}.jpg`,
        price: parseInt(data.event_data.ticket_price),
        quantity: tickets,
      };

      const response = await axiosInstance.post(
        "/payment_api/create-checkout-session/",
        payment_data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const session = response.data.stripe_session;

      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      console.log(result);

      if (result.error) {
        console.log(result.error);
        toast.error("Payment failed");
      }
    } catch (error) {
      console.log("Payment failed:", error);
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    if (data) {
      if (data.event_data.payment_required) {
        setTotal(calculateTotal(tickets));
      }
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  console.log(data);

  return (
    <>
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover "
      >
        <source
          src={`https://res.cloudinary.com/dzwjm8n8v/video/upload/v1731568818/${data.event_data.promo_video}.mp4`}
        />
        Your browser does not support the video tag.
      </video>
      <main className="relative pt-20 flex flex-1 justify-center items-center h-2/4 overflow-auto ">
        {/* <div>
          <img 
          src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${data.event_data.banner_image}.jpg`}
          alt={data.event_data.title}
          className="object-cover "
          />
          
        </div> */}
        <div className="container bg-gray-800 p-16 sm:w-3/4 md:w-2/4 ">
          <h1 className=" text-2xl font-bold mb-4">Book Your Tickets</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm font-bold">
                      Currently {data.event_data.participant_capacity} tickets
                      available.
                    </p>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          field.onChange(value);
                          setTickets(value);
                          setTotal(calculateTotal(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the number of tickets you want to purchase (max 10).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-xl font-bold">
                <table className="border-collapse w-full text-sm">
                  <tbody>
                    <tr>
                      <td>Total No. of tickets:</td>
                      <td className="text-right">{tickets}</td>
                    </tr>
                    <tr>
                      <td>Ticket Amount:</td>
                      <td className="text-right">
                        {data.event_data.payment_required
                          ? data.event_data.ticket_price
                          : "free"}
                      </td>
                    </tr>
                    <br />
                    <tr>
                      <td>Total:</td>
                      <td className="text-right">{total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button
                onClick={makePayment}
                className="rounded-none bg-sky-500"
                type="button"
              >
                Book Tickets
              </Button>
 
             
            </form>
          </Form>
        </div>
      </main>
    </>
  );
}
