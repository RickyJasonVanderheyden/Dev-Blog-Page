import { PostDetailPage } from '@/components/PostDetailPage'

export default async function PostDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  return <PostDetailPage postId={id} />
}


