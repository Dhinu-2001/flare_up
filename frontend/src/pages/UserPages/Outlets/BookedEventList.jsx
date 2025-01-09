import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Tickets, Laptop, Download } from "lucide-react";
import { useContext } from "react";
import { UserTicketHistoryDataContext } from "@/ContextFiles/UserTicketHistoryDataContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PreLoader from "@/Page_components/PreLoader/PreLoader";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { env } from "@/utils/env";

export default function BookedEventList() {
  const { data, loading, error, refreshData } = useContext(
    UserTicketHistoryDataContext
  );

  const [cloudName] = React.useState(env.VITE_cloudinary_name);

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = (imageId) => cld.image(imageId);

  if (loading) return <PreLoader />;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="min-h-screen bg-black py-20 px-4 md:px-6 lg:px-8">
      <div className="w-full h-full max-w-7xl mx-auto ">
        <h2 className="text-1xl md:text-2xl lg:text-2xl font-bold text-[#00ffcc] mb-8">
          Ticket History
        </h2>
        <div className="w-full px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {data.map((event) => (
              <Card
                key={event.registration_id}
                className="flex-shrink-0 snap-start"
              >
                <Link
                  to={`/catgory/${event.event.category.name}/${event.event.type.name}/${event.event.event_id}/`}
                >
                  <div className="aspect-video bg-muted relative">
                    {event.event?.banner_image ? (
                      <AdvancedImage
                        cldImg={myImage(event.event.banner_image)}
                        alt={event.event?.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Laptop className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    {/* <div className="flex flex-col items-start text-sm text-muted-foreground mb-2">
                    <span>Transaction_id:</span>
                    <span>{event.transaction_id}</span>
                  </div> */}
                    <CardTitle className="line-clamp-2 min-h-12">
                      {event.event.title}
                    </CardTitle>
                  </CardHeader>
                </Link>
                <CardContent>
                  <div className="flex flex-col items-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Tickets className="h-4 w-4" />
                      <span>Ticket quantity: </span>
                      <span>{event.ticket_quantity} Tickets</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Registered at: </span>
                      <span>
                        {new Date(event.registered_at).toLocaleString()}
                      </span>
                    </div>
                    <a
                      href={event.ticket_secure_url}
                      download={event.ticket_public_id}
                    >
                      <Button
                        type="button"
                        className="w-full sm:w-auto rounded-none"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Ticket
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
