// followController.ts
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const followUser = async (c: any) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const followerId = c.req.param('followerId');
    const followingId = c.req.param('followingId');

    if (followerId === followingId) {
      return c.json({ success: false, error: 'Users cannot follow themselves.' }, 400);
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: parseInt(followerId),
          followingId: parseInt(followingId),
        },
      },
    });

    if (existingFollow) {
      return c.json({ 
        success: false, 
        error: 'Already following this user' 
      }, 400);
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: parseInt(followerId),
        followingId: parseInt(followingId),
      },
    });

    return c.json({ success: true, follow });
  } catch (error) {
    console.error('Follow error:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    }, 500);
  }
};