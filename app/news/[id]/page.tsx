import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import NewsArticleData from "./NewsArticleData"

export const metadata: Metadata = {
  title: "News Article",
  description: "Read the latest news article",
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  return (
    <NewsArticleData id={params.id}>
      {(article) => (
        <div className="container mx-auto px-4 py-8">
          <Link href="/news" className="text-blue-500 hover:underline mb-4 inline-block">
            ← Back to News
          </Link>
          {article ? (
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={article.image_path || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-sm font-semibold text-blue-600">{article.category}</span>
                <h1 className="text-4xl font-bold mt-2 mb-4">{article.title}</h1>
                <p className="text-gray-500 text-sm mb-4">{new Date(article.date).toLocaleDateString()}</p>
                <div className="prose max-w-none mx-20" dangerouslySetInnerHTML={{ __html: article.description }} />
              </div>
            </article>
          ) : (
            <div>Article not found</div>
          )}
        </div>
      )}
    </NewsArticleData>
  )
}

