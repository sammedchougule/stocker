import { supabase } from "../../../lib/supabase"

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

interface NewsArticleDataProps {
  id: string
  children: (article: NewsArticle | null) => React.ReactNode
}

export default async function NewsArticleData({ id, children }: NewsArticleDataProps) {
  const article = await getNewsArticle(id)
  return children(article)
}

