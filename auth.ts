import NextAuth from "next-auth"
import authConfig from '@/auth.config'
import {getUserById} from '@/data/user'
import { PrismaAdapter } from "@auth/prisma-adapter"
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
        async session({ session, token }) {
            if(token.sub && session.user) {
                session.user.id = token.sub;
            }
            if(token.role && session.user) {
                session.user.role = token.role as "ADMIN" | "USER";
            }
            return session;
        },
        async jwt({ token }) {
            try {
                if (!token.sub) return token;

                const existingUser = await getUserById(token.sub) as { role?: "ADMIN" | "USER" };
                if (!existingUser) return token;

                token.role = existingUser.role;
                return token;
            } catch (err) {
                console.error("JWT callback error:", err);
                return token;
            }
        }

    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})