import { Resend } from 'resend';
const resend = new Resend(process.env.RESENT_API_KEY);

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Your 2FA Code",
        html: `<p>Your 2FA Code: ${token}</p>`
    });
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    //console.log("token inside the email:",token);
    const confirmLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p> Click <a href="${confirmLink}">here</a> to reset your password</p>`
    });
}


export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p> Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
}