'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export const getOrCreateUser = async (): Promise<number | null> => {
  //get user through auth
  const { userId: clerkUserId } = await auth();
  //if user does not exist ,return null
  if (!clerkUserId) {
    return null;
  }

  //then get current user from database
  const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkUserId)).limit(1);
  // if the user exists in database ,return user[0].id
  if (existingUser.length > 0) {
    return existingUser[0].id;
  }
  // if user does not exist in database,get clerkUser from currentUser(),if user does not exist ,return null

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const newUser = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      nameSnapshot: clerkUser.fullName ?? '',
      emailSnapshot: clerkUser.emailAddresses[0].emailAddress ?? '',
      imageSnapshot: clerkUser.imageUrl ?? '',
    })
    .returning({ id: users.id });
  //return user[0].id
  return newUser[0].id;
};
