import prisma from '../config/database';

export interface CreateCommentData {
  content: string;
}

export async function getCommentsByPostId(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createComment(
  postId: string,
  data: CreateCommentData,
  userId: string
) {
  return prisma.comment.create({
    data: {
      content: data.content,
      postId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          createdAt: true,
        },
      },
    },
  });
}


