"use server"

import * as z from 'zod'
import {RegisterSchema} from '@/schemas/index'
import {getUserByEmail} from '@/data/user'
import bcryptjs from 'bcryptjs'
import {db} from '@/lib/db'

export const Register = async (values: z.infer< typeof RegisterSchema >) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return{error: 'Invalid fields!'}
    }

    const { email, password, username } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return {error: "Email already in use!"};
    }

    await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })
    return { success: 'User Created!'};
}