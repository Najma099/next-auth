import { NextResponse } from "next/server";
import { genereteVerificationToken } from "@/lib/token"; 
import {sendVerificationEmail} from '@/lib/mail'

export async function POST(req: Request) {
  const { email } = await req.json();
  try {

    const token = await genereteVerificationToken(email);
    await sendVerificationEmail(token.email, token.token)
    return NextResponse.json({ token });

  } catch (err) {
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }
}
