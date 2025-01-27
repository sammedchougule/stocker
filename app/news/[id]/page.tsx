import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import type { Metadata, ResolvingMetadata } from "next"

async function getNewsArticle(id: string) {
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching news article:", error)
    return null
  }
  return data
}

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props, _parent: ResolvingMetadata): Promise<Metadata> {
  const article = await getNewsArticle(params.id)

  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image_path }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image_path],
    },
  }
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = await getNewsArticle(params.id)

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/news" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to News
      </Link>
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <Image
          src={article.image_path || "/placeholder.svg"}
          alt={article.title}
          width={800}
          height={600}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <span className="text-sm font-semibold text-blue-600">{article.category}</span>
          <h1 className="text-3xl font-bold mt-2 mb-4">{article.title}</h1>
          <p className="text-gray-500 text-sm mb-4">{new Date(article.date).toLocaleDateString()}</p>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.description }} />
        </div>
      </article>
    </div>
  )
}

