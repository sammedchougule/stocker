
// import type { Metadata } from "next"
// import { supabase } from "../../../lib/supabase"
// import Image from "next/image"
// import Link from "next/link"

// interface NewsArticle {
//   id: string
//   title: string
//   excerpt: string
//   description: string
//   category: string
//   sub_category: string
//   date: string
//   image_path: string
// }

// async function getNewsArticle(id: string): Promise<NewsArticle | null> {
//   const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

//   if (error) {
//     console.error("Error fetching news article:", error)
//     return null
//   }
//   return data
// }

// type Props = {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const article = await getNewsArticle(params.id)

//   if (!article) {
//     return {
//       title: "Article Not Found",
//     }
//   }

//   return {
//     title: article.title,
//     description: article.excerpt,
//     openGraph: {
//       title: article.title,
//       description: article.excerpt,
//       images: [{ url: article.image_path }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: article.title,
//       description: article.excerpt,
//       images: [article.image_path],
//     },
//   }
// }

// export default async function NewsArticlePage({ params }: Props) {
//   const article = await getNewsArticle(params.id)

//   if (!article) {
//     return <div>Article not found</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//         <Link href="/news" className="text-blue-500 hover:underline mb-4 inline-block">
//             ← Back to News
//         </Link>
//         <article className="bg-white rounded-lg shadow-md overflow-hidden">
//             {/* Image Section */}

//             {/* Title */}
//             <h1 className="text-4xl font-bold mx-40">{article.title}</h1>

//             <div className="relative pt-6 pb-6 mx-auto w-full max-w-3xl">
//             <Image 
//                 src={article.image_path || "/placeholder.svg"} 
//                 alt={article.title} 
//                 width={800}  // Set the width you want for the image
//                 height={450} // Set the height you want for the image
//                 className="object-cover rounded-lg mx-auto"
//             />
//             </div>

//             {/* Title, Category, Date, and Description */}
//             <div className="py-6">
//                 <div className="text-center mb-6">
//                     {/* Category */}
//                     <span className="text-sm font-semibold text-blue-600">{article.category}</span>
                    
//                     {/* Date */}
//                     <p className="text-gray-500 text-sm mt-4">{new Date(article.date).toLocaleDateString()}</p>
//                 </div>

//                 {/* Description */}
//                 <div className="prose max-w-none mx-60" dangerouslySetInnerHTML={{ __html: article.description }} />
//             </div>
//         </article>
//         </div>


//   )
// }


import { Metadata } from "next"
import { supabase } from "../../../lib/supabase"
import Image from "next/image"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  description: string
  category: string
  sub_category: string
  date: string
  image_path: string
}

async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase.from("news").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching news article:", error)
    return null
  }
  return data
}

type Props = {
  params: Promise<{ id: string }>  // Ensure this is a Promise that resolves to { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getNewsArticle((await params).id)  // Resolve the Promise

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

type PageProps = {
  article: NewsArticle
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await getNewsArticle((await params).id)  // Resolve the Promise

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/news" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to News
      </Link>
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Section */}
        <div className="relative pt-6 pb-6 mx-auto w-full max-w-3xl">
          <Image
            src={article.image_path || "/placeholder.svg"}
            alt={article.title}
            width={800} // Set the width you want for the image
            height={450} // Set the height you want for the image
            className="object-cover rounded-lg mx-auto"
          />
        </div>

        {/* Title, Category, Date, and Description */}
        <div className="py-6">
          <div className="text-center mb-6">
            {/* Category */}
            <span className="text-sm font-semibold text-blue-600">{article.category}</span>

            {/* Date */}
            <p className="text-gray-500 text-sm mt-4">{new Date(article.date).toLocaleDateString()}</p>
          </div>

          {/* Description */}
          <div className="prose max-w-none mx-60" dangerouslySetInnerHTML={{ __html: article.description }} />
        </div>
      </article>
    </div>
  )
}
