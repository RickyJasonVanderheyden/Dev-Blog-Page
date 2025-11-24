import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  avatar?: string;
}

export async function registerUser(data: RegisterData) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error('Email or username already exists');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      avatar: data.avatar,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email });

  return { user, token };
}

export async function loginUser(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await comparePassword(data.password, user.password);

  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    token,
  };
}

export async function updateProfile(userId: string, data: UpdateProfileData) {
  // Check if username or email is being changed and if they're already taken
  if (data.username || data.email) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              data.username ? { username: data.username } : {},
              data.email ? { email: data.email } : {},
            ].filter(obj => Object.keys(obj).length > 0),
          },
        ],
      },
    });

    if (existingUser) {
      throw new Error('Username or email already exists');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username && { username: data.username }),
      ...(data.email && { email: data.email }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  return { user: updatedUser };
}


