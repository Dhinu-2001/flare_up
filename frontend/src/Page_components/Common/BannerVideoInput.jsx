'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, VideoIcon } from 'lucide-react'
import EventBannerUploadCloudinary from '../CloudinaryComponents/EventBannerUploadCloudinary'

export default function Component({publicId, setPublicId}) {
  const [imagePreview, setImagePreview] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader)
      }
      reader.readAsDataURL(file)
      setVideoFile(null)
    } else if (file.type.startsWith('video/')) {
      setVideoFile(file)
      setImagePreview(null)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="sr-only">Choose a file</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            {/* <Button onClick={handleButtonClick} className="w-full">
              Upload Image or Video
            </Button> */}
            <EventBannerUploadCloudinary publicId={publicId} setPublicId={setPublicId} />

          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-w-full max-h-[180px] object-contain" />
            ) : videoFile ? (
              <div className="text-center">
                <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">{videoFile.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Image preview will appear here</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            {imagePreview ? 'Image uploaded successfully' : videoFile ? 'Video uploaded successfully' : 'No file uploaded'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}































// 'use client'

// import React, { useState, useRef, useCallback } from 'react'
// import ReactCrop from 'react-image-crop'
// import 'react-image-crop/dist/ReactCrop.css'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Card, CardHeader, CardTitle } from '@/components/ui/card'
// import { User } from 'lucide-react'

// export default function BannerVideoInput(props) {
//   const [bannerSrc, setBannerSrc] = useState(null)
//   const [crop, setCrop] = useState()
//   const [completedCrop, setCompletedCrop] = useState(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [videoSrc, setVideoSrc] = useState(null)
//   const imgRef = useRef(null)

//   const onBannerSelect = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const reader = new FileReader()
//       reader.addEventListener('load', () => {
//         props.setBannerSrc(reader.result?.toString() || null)
//         setIsModalOpen(true)
//       })
//       reader.readAsDataURL(e.target.files[0])
//     }
//   }

//   const onVideoSelect = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const reader = new FileReader()
//       reader.addEventListener('load', () => props.setVideoSrc(reader.result?.toString() || null))
//       reader.readAsDataURL(e.target.files[0])
//     }
//   }

//   const onCropComplete = useCallback((crop) => {
//     setCompletedCrop(crop)
//   }, [])

//   const getCroppedImg = useCallback(() => {
//     if (!completedCrop || !imgRef.current) return

//     const canvas = document.createElement('canvas')
//     const scaleX = imgRef.current.naturalWidth / imgRef.current.width
//     const scaleY = imgRef.current.naturalHeight / imgRef.current.height
//     canvas.width = completedCrop.width
//     canvas.height = completedCrop.height
//     const ctx = canvas.getContext('2d')

//     if (ctx) {
//       ctx.drawImage(
//         imgRef.current,
//         completedCrop.x * scaleX,
//         completedCrop.y * scaleY,
//         completedCrop.width * scaleX,
//         completedCrop.height * scaleY,
//         0,
//         0,
//         completedCrop.width,
//         completedCrop.height
//       )
//     }

//     canvas.toBlob((blob) => {
//       if (!blob) {
//         console.error('Canvas is empty')
//         return
//       }
//       const croppedImageUrl = URL.createObjectURL(blob)
//       props.setBannerSrc(croppedImageUrl)
//       setIsModalOpen(false)
//     })
//   }, [completedCrop])

//   return (
//     <Card className=" p-6 bg-black rounded-lg shadow-md max-w-2xl mx-auto">
//       <CardHeader className="flex flex-col items-start justify-between">
//           <div className="flex items-center">
//             <User className="w-6 h-6 text-white mr-2" />
//             <CardTitle>Add Media file</CardTitle>
//           </div>
//           <div className="flex items-center">
//             <p className="text-sm mb-4">Enter the details of event.</p>
//           </div>
//         </CardHeader>
//       <div className='my-3'>
//         <Label htmlFor="banner-upload" className="block text-sm font-medium text-white mb-2">
//           Banner Image
//         </Label>
//         <Input
//           id="banner-upload"
//           type="file"
//           accept="image/*"
//           onChange={onBannerSelect}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-800"
//         />
//         {props.bannerSrc && (
//           <div className="mt-4">
//             <img src={props.bannerSrc} alt="Cropped banner" className="max-w-full h-auto" />
//           </div>
//         )}
//       </div>

//       <div className='my-3'>
//         <Label htmlFor="video-upload" className="block text-sm font-medium text-white mb-2">
//           Promo Video
//         </Label>
//         <Input
//           id="video-upload"
//           type="file"
//           accept="video/*"
//           onChange={onVideoSelect}
//           className="block w-full text-sm text-gray-500 file:mr-4  file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-800"
//         />
//         {props.videoSrc && (
//           <div className="mt-4">
//             <video src={props.videoSrc} controls className="max-w-full h-auto">
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//       </div>

//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="sm:max-w-[800px]">
//           <DialogHeader>
//             <DialogTitle>Crop Banner Image</DialogTitle>
//           </DialogHeader>
//           {props.bannerSrc && (
//             <ReactCrop
//               crop={crop}
//               onChange={(_, percentCrop) => setCrop(percentCrop)}
//               onComplete={(c) => onCropComplete(c)}
//               aspect={1.91 / 1}
//             >
//               <img
//                 ref={imgRef}
//                 alt="Crop me"
//                 src={props.bannerSrc}
//                 style={{ maxWidth: '100%', maxHeight: '70vh' }}
//               />
//             </ReactCrop>
//           )}
//           <DialogFooter>
//             <Button onClick={getCroppedImg}>Crop Image</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   )
// }