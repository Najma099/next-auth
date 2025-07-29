import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/actions/signout'

const SettingPage = async () => {
  const session = await auth();

  return (
    <div className='text-amber-100'>
      {JSON.stringify(session)}
      <form action={signOutAction}>
        <Button type='submit'>
          Sign Out
        </Button>
      </form>
    </div>
  )
}

export default SettingPage;
