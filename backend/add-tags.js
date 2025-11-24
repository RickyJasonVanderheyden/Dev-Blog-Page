// Script to add tags to existing posts in the database
import prisma from './src/config/database.js';

async function addTagsToExistingPosts() {
  console.log('Starting to add tags to existing posts...');

  try {
    // Get all posts without tags
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { tags: { isEmpty: true } },
          { tags: null }
        ]
      }
    });

    console.log(`Found ${posts.length} posts without tags`);

    // Add sample tags based on post content
    const sampleTags = [
      ['javascript', 'programming', 'web development'],
      ['react', 'frontend', 'ui'],
      ['nodejs', 'backend', 'api'],
      ['css', 'design', 'responsive'],
      ['typescript', 'javascript', 'types'],
      ['database', 'sql', 'data'],
    ];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const tags = sampleTags[i % sampleTags.length];
      
      await prisma.post.update({
        where: { id: post.id },
        data: { tags: tags }
      });

      console.log(`Updated post "${post.title}" with tags: ${tags.join(', ')}`);
    }

    console.log('✅ Successfully added tags to all posts!');
  } catch (error) {
    console.error('❌ Error adding tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTagsToExistingPosts();