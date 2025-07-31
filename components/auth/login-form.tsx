"use client"

import {CardWrapper} from '@/components/auth/card-wrapper'
import * as z from 'zod'
import { useSearchParams} from 'next/navigation'
import {useTransition, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
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

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        const validated = LoginSchema.safeParse(values);

        if (!validated.success) {
            setError("Invalid fields");
            return;
        }

        const { email, password } = validated.data;
        const res = await axios.post("/api/auth/login/check-user", {
            email,
        });
        //console.log(res);
        const existingUser = res.data.user;
        //console.log(existingUser)

        if(!existingUser || !existingUser.email || !existingUser.password) {
           return setError("Email doesn't exits");
        }

       //console.log("emailVerified value:", existingUser.emailVerified);
        if(!existingUser.emailVerified) {
            //console.log("inside");
            const res = await axios.post("/api/auth/login/generate-token",
                {email},
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }    
            )
            //console.log("res:",res);
            const verificationToken = res.data.token;
            //console.log("verification:",verificationToken);
            //console.log("Token fixed")
            return setError("Confirmation Email send! Please confirm your email");
        }

        startTransition(() => {
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
                //console.error("Login error:", err);
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='*******'
                                            type='password'
                                            autoComplete="current-password"
                                        />
                                    </FormControl>
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