import { PaymentDetailDataContext } from "@/ContextFiles/PaymentDetail";
import { useContext } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Mail, Phone, User, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentDetail() {
  const { data, error, loading } = useContext(PaymentDetailDataContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;
  console.log("actual event data", data);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        {/* <Link to="/hoster/payments">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Payments
          </Button>
        </Link> */}
        {/* <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Invoice
        </Button> */}
      </div>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Payment Details</CardTitle>
          <CardDescription>
            Details for payment {data.payment_data.transaction_id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">
                {data.event_data.event_id.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Event Date :{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "short",
                  timeStyle: "medium",
                  hour12: true,
                }).format(new Date(data.event_data.event_id.start_date_time))}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                Rs. {data.payment_data.amount_received}
              </p>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    data.payment_data.status === "succeeded"
                      ? "bg-green-100 text-green-800"
                      : paymentDetails.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {data.payment_data.status === "succeeded" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium">
                Customer Information
              </Label>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{data.user_data.fullname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{data.user_data.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {data.user_data?.phone ? data.user_data?.phone : "NIL"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment Information</Label>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment ID:
                    </span>
                    <span>{data.payment_data.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Currency:
                    </span>
                    <span>{data.payment_data.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Date:
                    </span>
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "short",
                        timeStyle: "medium",
                        hour12: true,
                      }).format(new Date(data.payment_data.registered_at))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Label className="text-sm font-medium">Ticket Numbers</Label>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex-col items-center gap-4">
                    {data.event_data.ticket_details.map((ticket) => (
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <span>{ticket.ticket_number}</span><br/>
                        
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium">Order Details</Label>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Ticket Price</p>
                    <p className="text-sm text-muted-foreground">Quantity:</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rs. {data.event_data.event_id.ticket_price}
                    </p>
                    <p>{data.payment_data.ticket_quantity}</p>
                  </div>
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="p-4">
                <div className="flex justify-between w-full">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    Rs. {data.payment_data.amount_received}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
