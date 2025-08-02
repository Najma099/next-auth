"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { settings } from '@/actions/settings'
import { useTransition, useState } from 'react'
import { useSession } from 'next-auth/react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsSchema} from '@/schemas'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from'@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hook/use-current-user'
import { FormError } from '@/components/utils/form-error'
import { FormSucess } from '@/components/utils/form-sucess'
import { Switch } from '@/components/ui/switch'

const SettingPage = () => {
    const user = useCurrentUser();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const [ error, setError] = useState<string | undefined>();
    const [ success, setSuccess] = useState<string | undefined>();

    //console.log("user?.isOAuth",user?.isOAuth);
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
        }
    });

    const onSubmit = (values:z.infer<typeof SettingsSchema>) => {
        startTransition( ()=> {
            settings(values)
            .then( (data) => {
                if(data.error) {
                    setError(data.error);
                }

                if(data.success) {
                    update();
                    setSuccess(data.success)
                }
            })
            .catch(() => setError("Something went wrong!"));
        })
    }
    return (
        <Card className='w-[600] font-serif'>
            <CardHeader>
                <p className='text-2xl font-serif font-semibold text-center'>
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className='space-y-6 font-serif' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-4'>
                            <FormField 
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='John'
                                            disabled={isPending}
                                        />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            {user?.isOAuth === false && (
                                <>
                                    <FormField 
                                        control={form.control}
                                        name='email'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                <Input
                                                    {...field}
                                                    type='email'
                                                    placeholder='Johndoe@gmail.com'
                                                    disabled={isPending}
                                                />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='*******'
                                                    type='password'
                                                    disabled={isPending}
                                                />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField 
                                        control={form.control}
                                        name='newPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                <Input
                                                    {...field}
                                                    type='password'
                                                    placeholder='*******'
                                                    disabled={isPending}
                                                />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    /> 
                                    <FormField 
                                        control={form.control}
                                        name='isTwoFactorEnabled'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel>Two Factor Authentication</FormLabel>
                                                    <FormDescription>
                                                    Enable two factor authentication for your account
                                                    </FormDescription>
                                                </div>

                                                <FormControl>
                                                    <Switch
                                                    disabled={isPending}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        <FormError message={error}/>
                        <FormSucess message={success}/>
                        <Button type='submit' disabled={isPending}>
                            Save
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingPage;
