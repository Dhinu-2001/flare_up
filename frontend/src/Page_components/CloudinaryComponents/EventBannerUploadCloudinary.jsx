import { useState } from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { ImageIcon, VideoIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/utils/env";

import { getConfig } from '../../config';
let { VITE_cloudinary_name, VITE_cloudinary_upload_preset } = getConfig();

VITE_cloudinary_name = VITE_cloudinary_name || env.VITE_cloudinary_name
VITE_cloudinary_upload_preset = VITE_cloudinary_upload_preset || env.VITE_cloudinary_upload_preset

export default function EventBannerUploadCloudinary({ publicId, setPublicId }) {
  const [cloudName] = useState(VITE_cloudinary_name);
  const [uploadPreset] = useState(VITE_cloudinary_upload_preset);
  // Upload Widget Configuration
  // Remove the comments from the code below to add
  // additional functionality.
  // Note that these are only a few examples, to see
  // the full list of possible parameters that you
  // can add see:
  //   https://cloudinary.com/documentation/upload_widget_reference

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    cropping: true, //add a cropping step
    showAdvancedOptions: true,  //add advanced options (public_id and tag)
    croppingAspectRatio: 1.91, // Set aspect ratio to 1.91:1
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    multiple: false,  //restrict upload to a single file
    folder: "event_banner_images", //u pload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    clientAllowedFormats: ["png", "jpg", "wepb"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    theme: "red", //change to a purple theme
  });

  // Create a Cloudinary instance and set your cloud name.
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(publicId);

  return (
    <Card className="bg-black w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div >
            <h3>Upload event banner</h3>
            <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} idEle={"banner"} buttonText={'Upload banner'} />
            {/* <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} loadedType={bannerLoaded} setLoadedType={setBannerLoaded} idEle={"banner"} /> */}


          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center mt-2">
            {publicId ? (
              <AdvancedImage
                style={{ maxWidth: "100%" }}
                cldImg={myImage}
                plugins={[responsive(), placeholder()]}
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Image preview will appear here</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            {publicId ? 'Image uploaded successfully' : publicId ? 'Video uploaded successfully' : 'No file uploaded'}
          </p>
        </div>
      </CardContent>
    </Card >
  );
}
