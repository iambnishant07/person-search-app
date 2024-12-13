// app/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { User, userSchema, UserFormData } from './schemas'

// Search users by name
export async function searchUsers(query: string): Promise<User[]> {
  const users = await prisma.user.findMany({
    where: {
      name: {
        startsWith: query,
        mode: 'insensitive',
      },
    },
  });

  // Transform the database results to match schema expectations
  return users.map((user) => {
    return userSchema.parse({
      ...user,
      location: user.location ?? undefined, // Ensure null becomes undefined
    });
  });
}

// Add a new user
export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  // Check for duplicate email
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }
  }

  const validatedUser = userSchema.omit({ id: true }).parse(data);
  const newUser = await prisma.user.create({
    data: validatedUser,
  });

  return userSchema.parse(newUser);
}

// Update an existing user
export async function updateUser(userId: string, data: UserFormData): Promise<User> {
  const validatedUser = userSchema.omit({ id: true }).parse(data);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: validatedUser,
  });

  return userSchema.parse(updatedUser);
}

// Delete a user
export async function deleteUser(userId: string): Promise<void> {
  await prisma.user.delete({
    where: { id: userId },
  });
}
