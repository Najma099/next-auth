'use server'

import { signOut } from '@/auth'

export async function signOutAction() {
  //some server stuff
  await signOut();
}
