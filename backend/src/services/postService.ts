import prisma from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

export interface CreatePostData {
  title: string;
  content: string;
  excerpt: string;
  image?: string;
  tags: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export async function searchPostsService(query: string, userId?: string) {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
        {
          author: {
            username: { contains: query, mode: 'insensitive' }
          }
        }
      ],
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get like status for each post if user is authenticated
  if (userId) {
    const userLikes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: posts.map((p) => p.id) },
      },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    return posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      isLiked: likedPostIds.has(post.id),
    }));
  }

  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likes,
    commentCount: post._count.comments,
    isLiked: false,
  }));
}

export async function getAllPosts(userId?: string) {
  const posts = await prisma.post.findMany({
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get like status for each post if user is authenticated
  if (userId) {
    const userLikes = await prisma.like.findMany({
      where: {
        userId,
        postId: { in: posts.map((p) => p.id) },
      },
    });
    const likedPostIds = new Set(userLikes.map((l) => l.postId));

    return posts.map((post) => ({
      ...post,
      likeCount: post._count.likes,
      isLiked: likedPostIds.has(post.id),
    }));
  }

  return posts.map((post) => ({
    ...post,
    likeCount: post._count.likes,
    isLiked: false,
  }));
}

export async function getPostById(id: string, userId?: string) {
  const post = await prisma.post.findUnique({
    where: { id },
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  // Check if user liked this post
  let isLiked = false;
  if (userId) {
    const userLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });
    isLiked = !!userLike;
  }

  return {
    ...post,
    likeCount: post._count.likes,
    isLiked,
  };
}

export async function createPost(data: CreatePostData, authorId: string) {
  return prisma.post.create({
    data: {
      ...data,
      authorId,
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

export async function updatePost(id: string, data: UpdatePostData) {
  return prisma.post.update({
    where: { id },
    data,
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

export async function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  });
}

// Like system functions
export async function likePost(postId: string, userId: string) {
  try {
    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // User already liked, so unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      
      // Return updated count
      const likeCount = await prisma.like.count({ where: { postId } });
      return { liked: false, likeCount };
    } else {
      // User hasn't liked, so like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      
      // Return updated count
      const likeCount = await prisma.like.count({ where: { postId } });
      return { liked: true, likeCount };
    }
  } catch (error) {
    throw new Error('Failed to toggle like');
  }
}

