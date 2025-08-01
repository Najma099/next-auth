import { NextResponse } from "next/server";
import { getUserByEmail } from "@/data/user";

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ error: "Email is required" });
    const user = await getUserByEmail(email);

    if (!user) {
        return NextResponse.json({ error: "User not found" });
    }

    return NextResponse.json({user});
}