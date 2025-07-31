import { db } from '@/lib/db'

export const getPasswordTokenByToken = async ( token: string) => {
    console.log("getPasswordTokenByToken getting called inside");
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {
                token
            }
        });
        console.log("passwordResetToken:",passwordResetToken);
        return passwordResetToken;
    }
    catch(err) {
        console.log("coming out");
        return null;
    }
}

export const getPasswordTokenByEmail = async ( email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {
                email
            }
        });
        return passwordResetToken;
    } 
    catch(err) {
        return null;
    }
}