import { v4 as uuidv4} from 'uuid'
import { db} from '@/lib/db'
import { getVerificationTokenByEmail} from '@/data/verification-token'

export const genereteVerificationToken = async ( email: string) => {
   const token = uuidv4();
   console.log("Generated UUID:", token);
   const expires = new Date(new Date().getTime() + 3600 *  1000);
   const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        console.log("Deleting existing token:", existingToken.id);
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
    console.log("Inserted new token:", verificationToken);
    return verificationToken;   
}