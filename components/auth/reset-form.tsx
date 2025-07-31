"use client"

import {CardWrapper} from '@/components/auth/card-wrapper'
import * as z from 'zod'
import {useTransition, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {ResetSchema} from '@/schemas'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {FormError} from '@/components/utils/form-error'
import {FormSucess} from '@/components/utils/form-sucess'
import axios from 'axios'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from'@/components/ui/form'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { useRouter } from 'next/navigation'

export const ResetForm = () => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });


    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition( async () => {
            try {
                const res = await axios.post('/api/auth/login/reset-email', values, 
                    {   headers: {
                            "Content-Type": "application/json"
                        }
                    }  
                );
                if(res.data.message) {
                    setSuccess(res.data.message);
                }
                else {
                    setError(res.data.error)
                }
            }
            catch(err) {
               setError("Something went wrong!");
            }
        })

    }

    return(
        <CardWrapper
            headerLabel="Forgot your password?"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 font-serif'>
                    <div className='space-y-4'>
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
                                            autoComplete="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSucess message={success}/>
                    <Button type='submit' className='w-full' disabled={isPending}>
                        {isPending ? "Sending reset email..." : "Send reset email"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}