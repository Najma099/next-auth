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
    //const callbackUrl = searchParams.get('callbackUrl');
    const urlError = searchParams.get("error")=== 'OAuthAccountNotLinked'
        ? "Email is linked with different credential Provider"
        : ""
    
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
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

            const { email, password, code } = validated.data;
            const res = await axios.post("/api/auth/login/check-user", {email});

            const existingUser = res.data.user;
            if(!existingUser || !existingUser.email || !existingUser.password) {
                return setError("Email doesn't exists");
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

            if(existingUser.isTwoFactorEnabled && existingUser.email) {
                if(code) {
                    //console.log("ExistingUser:",existingUser.email,existingUser.id,code);
                    const res = await axios.post("/api/auth/login/verify-2FA",
                        {
                            email: existingUser.email,
                            id: existingUser.id,
                            code
                        },
                        {   headers: {
                                "Content-Type": "application/json"
                            }
                        }  
                    )
                    setSuccess(res.data.success);
                   
                } else {
                    //genereting new 2FA code n sending it 
                    const res = await axios.post("/api/auth/login/two-factor",{email},
                        {   headers: {
                                "Content-Type": "application/json"
                            }
                        }  
                    )
                    const twoFactor = res.data.twoFactor;
                    return setShowTwoFactor(twoFactor);
                }
            }

            signIn("credentials", {
                email: validated.data.email,
                password: validated.data.password,
                redirect: false,
            })
            .then((result) => {
                if (result?.error) {
                    form.reset();
                    setError(result.error);
                } else if (result?.ok) {
                    form.reset();
                    setSuccess("Login successful! Redirecting...");
                    setTimeout(() => {
                        router.push(DEFAULT_LOGIN_REDIRECT);
                    }, 1000);
                } 
            })
            .catch((err) => {
                console.log("you are coming here",err);
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
                        { !showTwoFactor && 
                            <>
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
                                                <Link href='/auth/reset'>Forgot password?</Link>
                                            </Button>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </>
                        }
                        {
                            showTwoFactor && 
                                <FormField 
                                    control={form.control}
                                    name='code'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Enter your 2FA Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder='123456'
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                        }
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSucess message={success}/>
                    <Button type='submit' className='w-full' disabled={isPending}>
                        {showTwoFactor
                            ? "Confirm your code"
                            : isPending
                            ? "Signing in..."
                            : "Sign in"
                        }
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}