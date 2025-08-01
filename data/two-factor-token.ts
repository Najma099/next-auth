import { db } from '@/lib/db'

export const getTwoFactorTokenByToken = async ( token : string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: {
                token
            }
        });
        return  twoFactorToken;
    }
    catch(err) {
        console.log("Error to fetch Two Factor Token from db:", err);
        return null;
    }
}

export const getTwoFactorTokenByEmail = async ( email : string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {
                email
            }
        });
        return  twoFactorToken;
    }
    catch(err) {
        console.log("Error to fetch Two Factor Token from db:", err);
        return null;
    }
}