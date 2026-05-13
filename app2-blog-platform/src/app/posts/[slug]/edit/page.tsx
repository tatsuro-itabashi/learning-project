import { notFound } from 'next/navigation'
import { requirePostOwner, handleAuthError } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { PostForm } from '@/components/post/PostForm'
import { updatePost } from '@/app/posts/_actions/postActions'

interface EditPostPageProps {
    params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { slug } = await params

    const post = await prisma.post.findUnique({
        where: { slug },
        include: { tags: { select: { name: true } } },
    })

    if (!post) notFound()

    // 権限チェック
    const authResult = await requirePostOwner(post.id)
    if (!authResult.ok) handleAuthError(authResult.error)

    const initialData = {
        title: post.title,
        content: post.content,
        slug: post.slug,
        status: post.status,
        tags: post.tags.map((t) => t.name).join(', '),
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900 mb-6">記事を編集</h1>
            <PostForm
                action={(formData) => updatePost(post.id, formData)}
                initialData={initialData}
            />
        </div>
    )
}