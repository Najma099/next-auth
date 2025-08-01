import { NextResponse } from "next/server";
import { generateTwoFactorToken } from "@/lib/token"; 
import { sendTwoFactorTokenEmail } from '@/lib/mail'

export async function POST(req: Request) {
  const { email } = await req.json();
  //console.log("Outside try-catch");
  try {
    //console.log('inside the axios backend')
    const token = await generateTwoFactorToken(email);
    await sendTwoFactorTokenEmail(token.email, token.token)
    return NextResponse.json({twoFactor: true});

  } catch (err) {
    //console.log(err);
    return NextResponse.json({ error: "Token generation failed" });
  }
}
