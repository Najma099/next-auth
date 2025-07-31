import * as z from 'zod';
import { NewPasswordSchema } from '@/schemas'
import { NextResponse } from "next/server";
import { db } from '@/lib/db'
import { getPasswordTokenByToken } from '@/data/password-resend-token'
import { getUserByEmail } from '@/data/user'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try{
        const { token, values } = await req.json();
        if(!token) {
            return NextResponse.json({ error: "Token doesnt exits"})
        }

        const parsed = NewPasswordSchema.safeParse(values);
        if (!parsed.success) {
            return NextResponse.json({ error: "Password should be atleast 6 character" });
        }
        
        console.log("token", token);
        const existingToken = await getPasswordTokenByToken(token);
        console.log("existingToken",existingToken);
        if(!existingToken) {
            return NextResponse.json({ error: "Invalid Token!"})
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            return NextResponse.json({ error: "Token has expired!" });
        }

        const { password } = parsed.data;
        const existingUser = await getUserByEmail( existingToken.email);
        if(!existingUser) {
            return NextResponse.json({ error: "Email doesnt exits"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.update({
            where: {id:  existingUser.id},
            data: {password: hashedPassword}
        });

        await db.passwordResetToken.delete({
            where: {id: existingToken.id}
        })
        return NextResponse.json({ message: "Password Updates Successfully!"});
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error" })
    }
}