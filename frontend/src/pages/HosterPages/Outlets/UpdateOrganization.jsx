import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Pen } from 'lucide-react'


function UpdateOrganization() {


    return (
        <div>
            <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Organization Information</CardTitle>
                    <Button className='border-2 border-white' variant="ghost" size="icon">
                        <Pen className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-6">
                    Organization, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
                    </p>
                    <div className="space-y-4">
                        <div>
                            <span className="font-semibold">Organization Name: </span>
                            <span className="text-gray-600">abc Organization</span>
                        </div>
                        <div>
                            <span className="font-semibold">Mobile: </span>
                            <span className="text-gray-600">234253456523</span>
                        </div>
                        <div>
                            <span className="font-semibold">Email: </span>
                            <span className="text-gray-600">aOrganization@mail.com</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdateOrganization
