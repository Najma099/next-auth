import { NextResponse } from "next/server";
import { getTwoFactorTokenByEmail} from '@/data/two-factor-token'
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, id, code } = await req.json();
    const twoFactorToken = await getTwoFactorTokenByEmail(email);
    if(!twoFactorToken )  return NextResponse.json({ error: "No 2FA code!"});
    if(twoFactorToken.token !== code) return NextResponse.json({ error: "Invalid Code"});

    const hasExpired = new Date(twoFactorToken.expires) < new Date();
    if( hasExpired ) return NextResponse.json({ error: "Token has expired"});

    await db.twoFactorToken.delete({
        where: {
            id: twoFactorToken.id,
        }
    })

    //const existingUser = await getUserByEmail(email);
    const existingConfirmation = await getTwoFactorConfirmationByUserId(id);
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
    return NextResponse.json({ error: "Token generation failed" });
  }
}
