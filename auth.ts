import NextAuth from "next-auth"
import authConfig from '@/auth.config'
import {getUserById} from '@/data/user'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation'
import { getAccountByUserId } from '@/data/account'
import { db} from '@/lib/db'


export const { handlers, signIn, signOut, auth } = NextAuth({
    pages:{
        signIn: '/auth/login',
        error: 'auth/error'
    },
    events: {
        async linkAccount({user}){
            await db.user.update({
                where: {id: user.id},
                data: { emailVerified: new Date()}
            })
        }
    },
    callbacks: {  
        async signIn({user, account}) {
            if(account?.provider !== 'credentials') return true;

            if (!user.id) return false;
            const existingUser = await getUserById(user.id);
            if(!existingUser?.emailVerified) return false;

           // console.log("existingUser.isTwoFactorEnabled",existingUser.isTwoFactorEnabled);
            if(existingUser.isTwoFactorEnabled) {
               const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if(!twoFactorConfirmation ) {
                    console.log("inside auth so we are returning false here");
                    return false;
                }

                await db.twoFactorConfirmation.delete({
                    where: {id: twoFactorConfirmation.id}
                })
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as "ADMIN" | "USER";
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if (session.user && token.name) {
                session.user.name = token.name;
            }

            if (session.user && token.email) {
                session.user.email = token.email;
            }

            if (session.user && typeof token.isOAuth !== "undefined") {
                session.user.isOAuth = token.isOAuth as boolean;
            }

            return session;
        },
        async jwt({ token }) {
            try {
                //console.log("JWT is being called");
                if (!token.sub) return token;

                const existingUser = await getUserById(token.sub) as {
                    id: string;
                    name?: string;
                    email?: string;
                    role?: "ADMIN" | "USER";
                    isTwoFactorEnabled?: boolean;
                };

                if (!existingUser) return token;
                //console.log("user id:", existingUser.id);
                const existingAccount = await getAccountByUserId(existingUser.id);
                //console.log("account result: hhhhh", existingAccount);
                token.isOAuth = !!existingAccount;
                console.log("isOAuth set in token:", token.isOAuth);
                token.name = existingUser.name;
                token.email = existingUser.email;
                token.role = existingUser.role;
                token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled as boolean;
                return token;
            } catch (err) {
                //console.error("JWT callback error:", err);
                return token;
            }
        }

    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})