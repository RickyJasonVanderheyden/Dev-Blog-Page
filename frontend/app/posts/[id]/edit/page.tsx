import { EditPostPage } from '@/components/EditPostPage'

export default function EditPost({ params }: { params: { id: string } }) {
  return <EditPostPage postId={params.id} />
}


