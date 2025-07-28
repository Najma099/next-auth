"use server"

import * as z from 'zod'
import {RegisterSchema} from '@/schemas/index'

export const Register = async (values: z.infer< typeof RegisterSchema >) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields) {
        return{error: 'Invalid fields!'}
    }

    return { success: 'Email send!'};
}