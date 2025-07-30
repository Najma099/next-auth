import { NextResponse } from "next/server";
import { genereteVerificationToken } from "@/lib/token"; 
import {sendVerificationEmail} from '@/lib/mail'

export async function POST(req: Request) {
 console.log("📩 POST /api/generate-token called");
  const { email } = await req.json();

  try {
    const token = await genereteVerificationToken(email);
    console.log("🪪 Received token from generate function:", token);
    await sendVerificationEmail(token.email, token.token)
    return NextResponse.json({ token });
  } catch (err) {
     console.error("❌ Error during token generation:", err);
    return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
  }
}
