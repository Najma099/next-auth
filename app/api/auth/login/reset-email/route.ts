import { NextResponse } from "next/server";
import { getUserByEmail } from '@/data/user';
import { ResetSchema } from '@/schemas/index';
import { sendPasswordResetEmail } from '@/lib/mail'
import {  generatePasswordResetToken } from '@/lib/token'

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = ResetSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid Email" });
        }

        const { email } = parsed.data;

        const user = await getUserByEmail(email);
        console.log("user",user);
        if (!user) {
            return NextResponse.json({ error: "Email doesn't exists" });
        }

        // we have to check it's via Credential or not 

        // TODO: Generate and send reset email here
        const passwordResentToken = await generatePasswordResetToken(email);
        console.log(" passwordResentToken:",passwordResentToken);
        await sendPasswordResetEmail(passwordResentToken.email, passwordResentToken.token);

        return NextResponse.json({ message: "Reset email sent" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" });
    }
}
