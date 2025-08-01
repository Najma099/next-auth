"use client"

import { CardWrapper } from '@/components/auth/card-wrapper'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState} from 'react'
import {FormError} from '@/components/utils/form-error'
import {FormSucess} from '@/components/utils/form-sucess'
import { DEFAULT_LOGIN_REDIRECT } from '@/route'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export const NewVerificationForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState< string | undefined>();
    const [success, setSuccess] =  useState< string | undefined>();
    const router = useRouter();

    const onSubmit = useCallback(async () => {
        if(!token) {
            setLoading(false);
            return setError("Missing Token")
        }
        try {
            const res = await axios.post("/api/auth/login/new-verification", { token }, {
                headers: {
                "Content-Type": "application/json",
                },
            });

            if (res.data.success) {
                //console.log("✅ Email verified");
                setSuccess(res.data.success);
                setTimeout(() => {
                    router.push(DEFAULT_LOGIN_REDIRECT);
                }, 1500);
                
            } else {
                //console.log("❌ Verification error:", res.data.error);
                setError(res.data.error)
            }
        } catch (err) {
            //console.error("❌ Request failed:", err);
            setError("Something went wrong")
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect( () => {
        onSubmit();
    },[])

    return(
     <CardWrapper
        headerLabel='Confirming your email'
        backButtonLabel = "back to login"
        backButtonHref='/auth/login'
    >
       <div className='flex items-center w-full justify-center'>
            {loading && <BeatLoader color="grey" />}
            {!loading && (
                <>
                <FormError message={error} />
                <FormSucess message={success} />
                </>
            )}
        </div> 
    </ CardWrapper>
   )
}