"use client"

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {Header} from '@/components/auth/header'
import {Social} from '@/components/auth/social'
import {BackButton} from '@/components/auth/back-button'

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
    showSocialmessage ?: string
};

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
    showSocialmessage,
}: CardWrapperProps) => {
    return(
       <Card className='w-full max-w-md mx-auto p-5 sm:mt-20 '>
        <CardHeader>
            <Header label={headerLabel}/>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
        {showSocial && (
        <>
            {showSocialmessage && (
            <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300 mr-2 ml-5"></div>
                <span className="text-gray-700 text-sm">{showSocialmessage}</span>
                <div className="flex-grow h-px bg-gray-300 ml-2 mr-5"></div>
            </div>
            )}
            <CardFooter>
            <Social />
            </CardFooter>
        </>
        )}

        <CardFooter>
            <BackButton
                label={backButtonLabel}
                href={backButtonHref}
            />
        </CardFooter>
       </Card>
    )
}