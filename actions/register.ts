"use server"

import * as z from 'zod'
import {RegisterSchema} from '@/schemas/index'
import {getUserByEmail} from '@/data/user'
import bcryptjs from 'bcryptjs'
import {db} from '@/lib/db'
import {genereteVerificationToken} from '@/lib/token'
import {sendVerificationEmail } from'@/lib/mail'

export const Register = async (values: z.infer< typeof RegisterSchema >) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return{error: 'Invalid fields!'}
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return {error: "Email already in use!"};
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken = await genereteVerificationToken(email);
    await sendVerificationEmail(verificationToken.email,verificationToken.token)
    return { success: 'Confirmation email send'};
}