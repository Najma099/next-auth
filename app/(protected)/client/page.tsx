'use client'

import { UserInfo } from '@/components/utils/user-info';
import { useCurrentUser } from '@/hook/use-current-user'

const ClientPage = () => {
    const user = useCurrentUser();
    return(
        <UserInfo 
            label='Client Component'
            user={user}
        />
    )
}
export default ClientPage;