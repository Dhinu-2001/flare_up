import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import React from 'react'

function LocationDetail({createEvent, errors}) {
  return (
    <Card className="min-w-72   max-w-xl flex-1 bg-black text-gray-100 ">
          <CardHeader className="flex flex-col items-start justify-between">
            <div className="flex items-center">
              <CalendarIcon className="w-6 h-6 text-white mr-2" />
              <CardTitle>Create Event</CardTitle>
            </div>
            <div className="flex items-center">
              <p className="text-sm mb-4">Enter the details of event.</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Event title
                  <span className="text-gray-400 text-xs ml-1">Required</span>
                </label>
                <Input id="title" placeholder="Event title" className="bg-black border-gray-600 rounded-full"
                  {...createEvent("title")}
                />
                {errors.title && <p className='text-white'>{errors.title.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Event description
                  <span className="text-gray-400 text-xs ml-1">Required</span>
                </label>
                <Textarea id="description" type="description" placeholder="Event description" className=" bg-black border-gray-600 rounded-lg"
                {...createEvent("description")}
                 />
                 {errors.description && <p>{errors.description.message}</p>}
              </div>
              <div>
                <label htmlFor="dob" className="text-sm font-medium">
                  Category
                  <span className="text-gray-400 text-xs ml-1">Required</span>
                </label>
                <Input id="category" placeholder="Meet-up" className="bg-black border-gray-600 rounded-full"
                {...createEvent("category")}
                 />
                 {errors.category && <p>{errors.category.message}</p>}
              </div>

              {/* <Button className="w-full bg-violet-700 hover:bg-violet-800">Become a member</Button> */}
            </div>
            {/* <p className="text-sm text-center mt-4">
              Already have an account? <a href="#" className="text-teal-400" onClick={() => setActiveSection('login')}>Log in</a>
            </p> */}
            
          </CardContent>
        </Card>
  )
}

export default LocationDetail
