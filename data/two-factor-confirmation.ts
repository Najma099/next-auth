import { db } from '@/lib/db'

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
    try {
        const twoFcatorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: {userId}
        });
        return twoFcatorConfirmation;
    }
    catch(err) {
        return null;
    }
}