import {  signOutAction } from '@/actions/signout'  

interface LogoutButtonProps {
    children ?: React.ReactNode
}

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        signOutAction();
    }
    return(
        <span className='cursor-pointer'>
            {children}
        </span>
    )
}