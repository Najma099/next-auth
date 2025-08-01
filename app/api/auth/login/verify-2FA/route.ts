import { NextResponse } from "next/server";
import { getTwoFactorTokenByEmail} from '@/data/two-factor-token'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  //console.log("Outside try-catch");
  try {
    const { email, id, code } = await req.json();
    const twoFactorToken = await getTwoFactorTokenByEmail(email);
    //console.log("we got done with getTwoFactorTokenByEmail")
    if(!twoFactorToken )  return NextResponse.json({ error: "No 2FA code!"});
    if(twoFactorToken.token !== code) return NextResponse.json({ error: "Invalid Code"});

    const hasExpired = new Date(twoFactorToken.expires) < new Date();
    if( hasExpired ) return NextResponse.json({ error: "Token has expired"});

    await db.twoFactorToken.delete({
        where: {
            id: twoFactorToken.id,
        }
    })

    const existingUser = await getUserByEmail(email);
    //console.log("we got the user");
    const existingConfirmation = await getTwoFactorConfirmationByUserId(id);
    //console.log("getTwoFactorConfirmationByUserId");
    if( existingConfirmation) {
        await db.twoFactorConfirmation.delete({
            where: {id: existingConfirmation.id}
        })
    }

    await db.twoFactorConfirmation.create({
        data: {
            userId: id
        }
    });
    return NextResponse.json({success:"the code is valid"});
  } catch (err) {
    //console.log(err);
    return NextResponse.json({ error: "Token generation failed" });
  }
}
