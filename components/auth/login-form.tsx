"use client"

import { CardWrapper } from '@/components/auth/card-wrapper'
import * as z from 'zod'
import { useSearchParams } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FormError } from '@/components/utils/form-error'
import { FormSucess } from '@/components/utils/form-sucess'
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from'@/components/ui/form'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { useRouter } from 'next/navigation'

export const LoginForm = () => {

    const searchParams = useSearchParams();
    const urlError = searchParams.get("error")=== 'OAuthAccountNotLinked'
        ? "Email is linked with different credential Provider"
        : ""
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        const validated = LoginSchema.safeParse(values);
        if (!validated.success) {
            return setError("Invalid fields");
        }

        startTransition( async() => {

            const { email, password } = validated.data;
            const res = await axios.post("/api/auth/login/check-user", {email});

            const existingUser = res.data.user;
            if(!existingUser || !existingUser.email || !existingUser.password) {
            return setError("Email doesn't exits");
            }

            if(!existingUser.emailVerified) {
                const res = await axios.post("/api/auth/login/generate-token",{email},
                    {   headers: {
                            "Content-Type": "application/json"
                        }
                    }    
                )
                const verificationToken = res.data.token;
                return setError("Confirmation Email send, Please confirm your email");
            }
            signIn("credentials", {
                email: validated.data.email,
                password: validated.data.password,
                redirect: false,
            })
            .then((result) => {
                if (result?.error) {
                    switch (result.error) {
                        case "CredentialsSignin":
                            setError("Invalid email or password!");
                            break;
                        case "CallbackRouteError":
                            setError("Invalid credentials!");
                            break;
                        default:
                            setError("Something went wrong!");
                    }
                } else if (result?.ok) {
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        router.push(DEFAULT_LOGIN_REDIRECT);
                    }, 1000);
                } else {
                    setError("Something went wrong!");
                }
            })
            .catch((err) => {
                setError("Network error. Please try again.");
            });
        });
    }

    return(
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an Account?"
            backButtonHref="/auth/register"
            showSocial
            showSocialmessage='or Continue with'
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
                        <FormField 
                            control={form.control}
                            name='password'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel >Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='*******'
                                            type='password'
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
                                    <Button 
                                        size='sm'
                                        variant='link'
                                        asChild
                                        className='w-full text-left justify-start px-0 text-xs'
                                    >
                                        <Link href='/auth/reset'>Forgot Passport?</Link>
                                    </Button>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSucess message={success}/>
                    <Button type='submit' className='w-full' disabled={isPending}>
                        {isPending ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}