import { auth} from '@/auth'
const SettingPage = async () => {
    const session = await auth();
    return(
        <div className='text-amber-100'>{JSON.stringify(session)}</div>
    )
}

export default SettingPage;