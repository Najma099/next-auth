"use client"
import { Button } from '@/components/ui/button'
import  { signOut } from 'next-auth/react'
import {useCurrentUser} from '@/hook/use-current-user'

const SettingPage = () => {
    const user = useCurrentUser();
    const onClick = () => {
        signOut();
    }
    return (
        <div className='bg-white p-10 rounded-xl'>
            <Button onClick={onClick} type='submit'>
                Sign Out
            </Button>
        </div>
    )
}

export default SettingPage;
