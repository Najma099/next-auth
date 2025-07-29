"use client"

import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import {useTransition, useState} from 'react'
import {CardWrapper} from '@/components/auth/card-wrapper'
import {RegisterSchema} from '@/schemas/index'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {FormError} from '@/components/utils/form-error'
import {FormSucess} from '@/components/utils/form-sucess'
import {Register} from '@/actions/register'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from'@/components/ui/form'


export const RegisterForm = () => {

    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined >('');
    const [success, setSuccess] = useState <string | undefined>('');

    const form = useForm <z.infer<typeof RegisterSchema>>( {
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");
    
        startTransition(() => {
            Register(values)
                .then( (data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
    }

    return(
        <CardWrapper
            headerLabel="Create an account in Auth Authentication"
            backButtonLabel="Already have an Account?"
            backButtonHref="/auth/login"
            showSocial
            showSocialmessage='or Continue with'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 ont-serif'>
                    <div className='space-y-6'>
                        <FormField 
                            control={form.control}
                            name='username'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='john'
                                            type='text'
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='john.doe@example.com'
                                            type='email'
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control}
                            name='password'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='******'
                                            type='password'
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSucess message={success}/>
                    <Button type='submit' className='w-full'  disabled={isPending}>
                        Create an Account
                    </Button>
                </form>

            </Form>
        </CardWrapper>
    )
}