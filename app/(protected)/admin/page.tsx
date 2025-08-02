"use client"

import { RoleGate } from '@/components/auth/role-gate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FormSucess } from '@/components/utils/form-sucess';
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'
import axios from 'axios'
import { admin } from '@/actions/admin'
// import { currentRole } from '@/lib/auth'
export const AdminPage =  () => {

    const onApiRouteClick = async () => {
        try {
            const res = await axios.get('/api/admin');
            if (res.status === 200) {
                toast.success("Allowed API route")
            } else {
               toast.error("Forbidden")
            }
        } catch (err: any) {
            if (err.response && err.response.status === 403) {
               toast.error("Forbidden")
            } else {
                toast.error(err);
            }
        }
    }

    const onServerAction = () => {
        admin()
            .then((data) => {
                if(data.success) {
                    toast.success(data.success)
                }
                else {
                    toast.error(data.error)
                }
            })
    }
    return(
        <Card className='w-[600px]'>
            <CardHeader>
                <p className='text-2xl font-serif text-center font-semibold'>
                    Admin Page
                </p>
            </CardHeader>
            <CardContent className='space-y-4'>
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSucess  message='You are allowed to view this content'/>
                     <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md font-serif'>
                        <p className='text-sm font-medium'>
                            Admin-only API route</p>
                        <Button onClick={onApiRouteClick}>
                            Click to test
                        </Button>
                    </div>
                    <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md font-serif'>
                        <p className='text-sm font-medium'>
                            Admin-only Server Action</p>
                        <Button onClick={onServerAction}>
                            Click to test
                        </Button>
                    </div>
                </RoleGate>
            </CardContent>
        </Card>
    )
}

export default AdminPage;