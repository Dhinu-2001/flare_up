import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SelectContent, SelectTrigger } from '@radix-ui/react-select'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

function Title({ createEvent, errors, category, type, setCategory, setType, categoriesTypesData }) {
  const [availableTypes, setAvailableTypes] = useState(null)

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
            {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Event description
              <span className="text-gray-400 text-xs ml-1">Required</span>
            </label>
            <Textarea id="description" type="description" placeholder="Event description" className=" bg-black border-gray-600 rounded-lg"
              {...createEvent("description")}
            />
            {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className='flex flex-col items-start'>
              <label htmlFor="dob" className="text-sm font-medium">
                Event Category
                <span className="text-gray-400 text-xs ml-1">Required</span>
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setAvailableTypes(categoriesTypesData?.find((cate) => cate.id.toString() === e.target.value)?.event_types)
                  console.log(availableTypes)
                }}
                className="w-full p-1 m-2 ml-0 h-9 bg-stone-900 border-gray-600 rounded-lg text-gray-300 text-sm font-normal"
              >
                <option value="" disabled>
                  {categoriesTypesData?.find((cate) => cate.id.toString() === category)?.name || 'Select a category'}
                </option>
                {categoriesTypesData && categoriesTypesData.length > 0 ? (
                  categoriesTypesData.map((cate) => (
                    <option key={cate.id} value={cate.id.toString()}>
                      {cate.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Category is not available</option>
                )}
              </select>

              <p className="text-sm text-gray-400">
                {categoriesTypesData?.find(cate => cate.id.toString() === category)?.description || 'Select a category to see its description'}
              </p>
              {/* {errors.category && <p>{errors.category.message}</p>} */}
            </div>
            <div>
              <label htmlFor="dob" className="text-sm font-medium">
                Event Type
                <span className="text-gray-400 text-xs ml-1">Required</span>
              </label>


              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-1 m-2 ml-0 h-9 bg-stone-900 border-gray-600 rounded-lg text-gray-300 text-sm font-normal"
              >
                <option value="" disabled>
                  {availableTypes?.find((typ) => typ.id.toString() === type)?.name || 'Select a type'}
                </option>

                {availableTypes && availableTypes.length > 0? (
                  availableTypes.map((typ) => (
                    <option key={typ.id} value={typ.id.toString()}>
                      {typ.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No types available</option>
                )}
              </select>

              <p className="text-sm text-gray-400">
                {availableTypes?.find(typ => typ.id.toString() === type)?.description || 'Select a type to see its description'}
              </p>
              {/* {errors.category && <p>{errors.category.message}</p>} */}
            </div>
          </div>


        </div>


      </CardContent>
    </Card>
  )
}

export default Title
