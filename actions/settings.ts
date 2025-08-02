'use server'
import * as z from 'zod';
import { SettingsSchema } from '@/schemas'
import { db } from '@/lib/db'
import { currentUser } from '@/lib/auth'
import { getUserByEmail,getUserById } from '@/data/user'
import { genereteVerificationToken } from '@/lib/token'
import { sendVerificationEmail } from '@/lib/mail'
import bcrypt from 'bcryptjs'

export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();
    if(!user || !user.id) {
        return { error: "Unauthorized"}
    }

    const dbUser = await getUserById(user.id);
    if(!dbUser) {
        return { error: "Unauthorized"}
    }

    if(user?.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined
    }

    if(values.email && values.email !== user.email) {
        values.email = values.email.trim().toLowerCase();

        const existingUser = await getUserByEmail(values.email);
        if(existingUser && existingUser.id !== user.id) {
            return { error: "Email already in user!"};
        }

        const verificationToken = await genereteVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { success: "Verification Email Send!"};
    }

    if(values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.hash(values.password, 10);
        values.password =  passwordMatch;
        values.newPassword = undefined
    }
    await db.user.update({
        where: {id: dbUser.id},
        data: {
            ...values
        }
    })
    return { success: "Setting updated!"}
}