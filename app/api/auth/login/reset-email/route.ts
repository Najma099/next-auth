import { NextResponse } from "next/server";
import { getUserByEmail } from '@/data/user';
import { ResetSchema } from '@/schemas/index';
import { sendPasswordResetEmail } from '@/lib/mail'
import {  generatePasswordResetToken } from '@/lib/token'
import { currentUser } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ResetSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid Email" });
        }

        const { email } = parsed.data;

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: "Email doesn't exists" });
        }

        const userSession = await currentUser();
        if (!userSession?.isOAuth) {
            return NextResponse.json({ error: "Password reset not allowed for OAuth accounts" });
        }

        const passwordResentToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(passwordResentToken.email, passwordResentToken.token);

        return NextResponse.json({ message: "Reset email sent" });
    } catch (err) {
        return NextResponse.json({ error: "Internal server error" });
    }
}
