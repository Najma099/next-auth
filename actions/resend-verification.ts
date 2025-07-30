'use server';

import { getUserByEmail } from '@/data/user';
import { genereteVerificationToken } from '@/lib/token';
import { revalidatePath } from 'next/cache';

export const resendVerificationEmail = async (email: string): Promise<{ success?: string; error?: string }> => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { error: "User not found." };
    }

    if (user.emailVerified) {
      return { error: "Email is already verified." };
    }

    if (!user.email) throw new Error("User email is missing.");
    await genereteVerificationToken(user.email);

    return { success: "Verification email sent successfully!" };
  } catch (err) {
    console.error("Resend verification error:", err);
    return { error: "Something went wrong. Please try again." };
  }
};
