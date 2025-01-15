import { useEffect, useState } from "react";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { ImageIcon, VideoIcon } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/utils/env";
import axiosInstance from "@/axiosconfig";
import { store } from "../../redux/Store";
import { toast } from "sonner";

import { getConfig } from '../../config';
let { VITE_cloudinary_name, VITE_cloudinary_upload_preset } = getConfig();

VITE_cloudinary_name = VITE_cloudinary_name || env.VITE_cloudinary_name
VITE_cloudinary_upload_preset = VITE_cloudinary_upload_preset || env.VITE_cloudinary_upload_preset



export default function ParticipantsSponsers({ publicId, setPublicId, folder }) {
    const [cloudName] = useState(VITE_cloudinary_name);
    const [uploadPreset] = useState(VITE_cloudinary_upload_preset);
    const state = store.getState()
    const user_id = state.id
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
        folder: folder, //u pload files to the specified folder
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


    // const sendPublicIdToBackend = async (id) => {
    //     try {
    //         const response = await axiosInstance.patch(`/user/${user_id}/update_user_profile/`,
    //             { 'profile_publicId': id },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             }
    //         );
    //         console.log(response.data)
            
    //         toast.success('Profile picture updated successfully')
    //         setPublicId()
    //         await refreshData();
    //     } catch (error) {
    //         console.log('Profile picture updation failed:', error)
    //         toast.error('Profile picture updation failed')
    //       } 
    // };

    // useEffect(() => {
    //     console.log(publicId)
    //     if (publicId) {
    //         sendPublicIdToBackend(publicId);
    //     }
    // }, [publicId]);


    

    return (
        <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} idEle={"photo"} buttonText={'Upload photo'} />
    );
}
