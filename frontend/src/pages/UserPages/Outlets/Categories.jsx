import { Button } from "@/components/ui/button";
import { DataContext } from "@/ContextFiles/DataProvider";
import PreLoader from "@/Page_components/PreLoader/PreLoader";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { env } from "@/utils/env";

import { getConfig } from '../../../config';
let { VITE_cloudinary_name } = getConfig();

VITE_cloudinary_name = VITE_cloudinary_name || env.VITE_cloudinary_name


export default function Categories() {
  const { data, loading, error } = useContext(DataContext);
  const [cloudName] = useState(VITE_cloudinary_name);

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = (imageId) => cld.image(imageId);

  if (loading) return <PreLoader />;
  if (error) return <p>Error loading data</p>;

  return (
    <section className="bg-gradient-to-tl from-stone-800 to-black py-20 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00ffcc] mb-8">
          Specialists in the truly special
        </h2>

        <p className="text-white/90 text-lg md:text-xl max-w-3xl mb-16 leading-relaxed">
          Our close-knit team of over 100 thinkers, doers, organisers and makers
          work in harmony with you, and each other, to deliver the desired
          result. A unique set of skills that combine the best of creative
          agency thinking and production company doing in one seamless process.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((category, index) => (
            <div key={index} className="relative group overflow-hidden">
              <AdvancedImage
                cldImg={myImage(category.category_image)}
                alt={category.name}
                className="w-full h-[200px] object-cover"
              />
            
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <h3 className="text-white text-2xl md:text-3xl font-bold">
                  {category.name}
                </h3>
                <Link to={`/catgory/${category.name}`}>
                  <Button
                    variant="outline"
                    className="w-fit rounded-none bg-[#00ffcc] text-black border-none hover:bg-[#00ffcc]/90 transition-colors"
                  >
                    FIND OUT MORE
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
