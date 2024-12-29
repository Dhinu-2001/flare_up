'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { VideoIcon, XIcon } from 'lucide-react'
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedVideo, responsive, placeholder } from "@cloudinary/react";
import { env } from '@/utils/env'

export default function PromoVideoUploadCloudinary({ publicId, setPublicId }) {
    const [cloudName] = useState(env.VITE_cloudinary_name);
    const [uploadPreset] = useState(env.VITE_cloudinary_upload_preset);
    // const [videoFile, setVideoFile] = useState(null)
    // const [videoPreviewUrl, setVideoPreviewUrl] = useState(null)
    // const fileInputRef = useRef(null)
    const [promovideoLoaded, setPromoVideoLoaded] = useState(false);
    
    const [uwConfig] = useState({
        cloudName,
        uploadPreset,
        showAdvancedOptions: true,  //add advanced options (public_id and tag)
        //croppingAspectRatio: 1.91, // Set aspect ratio to 1.91:1
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        multiple: false,  //restrict upload to a single file
        folder: "event_promo_videos", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        clientAllowedFormats: ["mp4","mkv"], //restrict uploading to image files only
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

    const myVideo = cld.video(publicId);

    // const handleFileChange = (event) => {
    //     const file = event.target.files?.[0]
    //     if (!file) return

    //     if (file.type.startsWith('video/')) {
    //         setVideoFile(file)
    //         const videoUrl = URL.createObjectURL(file)
    //         setVideoPreviewUrl(videoUrl)
    //     } else {
    //         alert('Please select a video file.')
    //     }
    // }

    // const handleButtonClick = () => {
    //     fileInputRef.current?.click()
    // }

    // const handleRemoveVideo = () => {
    //     setVideoFile(null)
    //     setVideoPreviewUrl(null)
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = ''
    //     }
    // }

    // const formatFileSize = (bytes) => {
    //     if (bytes === 0) return '0 Bytes'
    //     const k = 1024
    //     const sizes = ['Bytes', 'KB', 'MB', 'GB']
    //     const i = Math.floor(Math.log(bytes) / Math.log(k))
    //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    // }

    return (
        <Card className="bg-black w-full max-w-md mx-auto">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div>
                        <h3>Upload event promo video</h3>
                        <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} idEle={"promovideo"} buttonText={'Upload video'}  />
                        {/* <Label htmlFor="video-upload" className="sr-only">Choose a video file</Label>loadedType, setLoadedType
                        <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <Button onClick={handleButtonClick} className="w-full">
                            Upload Video
                        </Button> */}
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center mt-2">
                        {publicId ? (
                            <AdvancedVideo
                                style={{ maxWidth: "100%" }}
                                cldVid={myVideo}
                                controls
                                plugins={[responsive(), placeholder()]}
                            />
                        ) : (
                            <div className="text-center">
                                <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Upload a video to preview</p>
                            </div>
                        )}
                    </div>

                    {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                        {videoPreviewUrl ? (
                            <div className="w-full">
                                <video
                                    src={videoPreviewUrl}
                                    controls
                                    className="w-full max-h-[300px]"
                                    aria-label="Video preview"
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div className="mt-2 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        <p>{videoFile?.name}</p>
                                        <p>{formatFileSize(videoFile?.size || 0)}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRemoveVideo}
                                        aria-label="Remove video"
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">Upload a video to preview</p>
                            </div>
                        )}
                    </div> */}

                    <p className="text-sm text-gray-500 text-center">
                        {publicId ? 'Video uploaded successfully' : 'No video uploaded'}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

{/* <AdvancedVideo
                  style={{ maxWidth: "100%" }}
                  cldVid={myImage}
                  controls
                  plugins={[responsive(), placeholder()]}
                /> */}