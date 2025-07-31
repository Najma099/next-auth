import { v4 as uuidv4} from 'uuid'
import { db} from '@/lib/db'
import { getVerificationTokenByEmail} from '@/data/verification-token'
import { getPasswordTokenByEmail } from '@/data/password-resend-token'

export const generatePasswordResetToken = async( email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 *  1000);
    const existingToken = await getPasswordTokenByEmail(email);

    if(existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id:existingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    });
    console.log("passwordResetToken:",passwordResetToken);
    return passwordResetToken;   
}

export const genereteVerificationToken = async ( email: string) => {
   const token = uuidv4();
   const expires = new Date(new Date().getTime() + 3600 *  1000);
   const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await db.verificationToken.delete({
            where: {
                id:existingToken.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    });
    return verificationToken;   
}