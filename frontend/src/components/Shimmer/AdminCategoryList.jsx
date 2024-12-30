import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'

function AdminCategoryListShimmer() {
  return (
    <>
    <div className="mb-6 flex justify-between items-center">
        <div>
            <div className="animate-pulse">
                <div className="h-8 w-64 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-80 bg-gray-300 rounded"></div>
            </div>
        </div>
        <div className="animate-pulse">
            <div className="h-10 w-40 bg-gray-300 rounded"></div>
        </div>
    </div>

    <Card>
        <CardHeader>
            <div className="animate-pulse">
                <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse flex items-center justify-between p-4 border rounded-lg"
                    >
                        <div className="space-y-3 w-full">
                            <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3].map((_, typeIndex) => (
                                    <div
                                        key={typeIndex}
                                        className="h-4 w-20 bg-gray-300 rounded"
                                    ></div>
                                ))}
                            </div>
                            <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 bg-gray-300 rounded"></div>
                            <div className="h-10 w-10 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
</>

  )
}

export default AdminCategoryListShimmer
