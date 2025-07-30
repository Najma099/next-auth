import { Resend } from 'resend';

const resend = new Resend(process.env.RESENT_API_KEY);

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `https://localhost:3000/auth/new-verfication?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p> Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
}