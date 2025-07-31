import { NextResponse } from "next/server";
import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import {  getPasswordTokenByToken } from '@/data/password-resend-token';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    console.log(token);

    const existingToken = await getPasswordTokenByToken(token);
    if (!existingToken) {
      return NextResponse.json(
          { error: "Token doesn't exist!" }, 
        );
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json(
          { error: "Token has expired!" }, 
        );
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
      return NextResponse.json(
          { error: "Email does not exist!" }, 
        );
    }

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return NextResponse.json({ success: "Email verified!" });
  } catch (err) {
    console.error("❌ Verification error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
