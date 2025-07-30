import {Header} from '@/components/auth/header'
import {BackButton} from '@/components/auth/back-button'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'

export const ErrorCard = () => {
    return(
        <Card className='text-black text-2xl w-[400px]'>
            <CardHeader>
                <Header label='Oops! Something went wrongs!'></Header>
            </CardHeader>
            <CardFooter>
                <BackButton
                    label='Back to login'
                    href='/auth/login'
                ></BackButton>
            </CardFooter>
        </Card>
    )
}