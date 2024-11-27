'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, User2, User2Icon } from 'lucide-react'
import CloudinaryUploadWidget from "../CloudinaryComponents/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

export default function AddMember(props) {
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [role, setRole] = useState('')
  // const [employees, setEmployees] = useState([])
  // Replace with your own cloud name
  const [cloudName] = useState("dzwjm8n8v");
  // Replace with your own upload preset
  const [uploadPreset] = useState("ytxktrtm");

  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    //cropping: true, //add a cropping step
    showAdvancedOptions: true,  //add advanced options (public_id and tag)
    //croppingAspectRatio: 1.91, // Set aspect ratio to 1.91:1
    // sources: [ "local", "url"], // restrict the upload sources to URL and local files
    multiple: false,  //restrict upload to a single file
    folder: "event_keyparticipants_images", //upload files to the specified folder
    // tags: ["users", "profile"], //add the given tags to the uploaded files
    // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
    clientAllowedFormats: ["png", "jpg", "wepb"], //restrict uploading to image files only
    // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
    // maxImageWidth: 2000, //Scales the image down to a width of 2000 pixels before uploading
    theme: "red", //change to a purple theme
  });

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage = cld.image(props.publicId);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdd = () => {
    if (props.designation && props.role) {
      if (image && name && designation && role) {
        props.setList([...props.list, { image, name, designation, role }])
        setImage('')
        setName('')
        setDesignation('')
        setRole('')
      }
    } else {
      if (image && name) {
        props.setList([...props.list, { image, name }])
        setImage('')
        setName('')
      }
    }
  }

  return (
    <div className=" border-collapse grid md:grid-cols-2 p-4 gap-8 w-full h-full">
      <Card className="bg-black text-gray-100 p-4 min-w-72">
        <CardHeader className="flex flex-col items-start justify-between">
          <div className="flex items-center">
            <User className="w-6 h-6 text-white mr-2" />
            <CardTitle>{props.title}</CardTitle>
          </div>
          <div className="flex items-center">
            <p className="text-sm mb-4">Enter the details of event.</p>
          </div>
        </CardHeader>
        <div className="mb-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-2"
          />
          {/* {image && ( */}
          <div className="w-32 h-32 rounded-full overflow-hidden mb-2">
            <img src={image ? image : "https://github.com/shadcn.png"} alt="update photo" className="w-full h-full object-cover" />
          </div>
          {/* )} */}
        </div>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
        />
        {props.designation && (
          <Input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="mb-2"
          />)}
        {props.role && (
          <Input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mb-2"
          />)}
        <Button onClick={handleAdd}>Add</Button>
      </Card>

      <Card className="bg-black text-gray-100  h-full max-h-screen overflow-y-auto border rounded-md p-4">
        <h2 className="text-xl font-bold mb-4">{props.list_title}</h2>
        <div className="space-y-4">
          {props.list.map((employee, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-2">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                  <img src={employee.image} alt={employee.name} className="w-full h-full object-cover" />
                </div>
                <div className='flex justify-between'>
                  <div>
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.designation}</p>
                    <h3 className="font-semibold">{employee.role}</h3>
                  </div>
                  <div className=''>
                    <Button>X</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  )
}