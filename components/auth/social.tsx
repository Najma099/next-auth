"use client"

import { useState } from "react"
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { Button } from "@/components/ui/button"
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { Loader2 } from "lucide-react"

export const Social = () => {
  const [loadingProvider, setLoadingProvider] = useState<null | "google" | "github">(null)

  const onClick = (provider: "google" | "github") => {
    setLoadingProvider(provider)
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <div className='flex flex-col items-center w-full gap-x-2 gap-y-4'>
      <Button
        className='w-full'
        size='lg'
        variant='outline'
        onClick={() => onClick('google')}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === 'google' ? (
          <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
        ) : (
          <FcGoogle className='h-5 w-5' />
        )}
      </Button>

      <Button
        className='w-full'
        size='lg'
        variant='outline'
        onClick={() => onClick('github')}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === 'github' ? (
          <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
        ) : (
          <FaGithub className='h-5 w-5' />
        )}
      </Button>
    </div>
  )
}
