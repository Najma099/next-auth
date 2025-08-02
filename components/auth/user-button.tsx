'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'
import { useCurrentUser } from '@/hook/use-current-user'
import { LogoutButton } from '@/components/auth/logout-button'
import { ExitIcon } from '@radix-ui/react-icons'

export const UserButton = () => {
    const user = useCurrentUser();
    //console.log("👤 User:", user);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage
                        src={user?.image ||  undefined}
                        alt={user?.name || "User"}
                        className="border-none"
                    />
                    <AvatarFallback className='bg-black'>
                        <FaUser className='text-white'/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='font-serif w-40' align='end'>
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className='h-4 w-4 mr-1'/>
                            Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
