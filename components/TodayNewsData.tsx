import { supabase } from "../lib/supabase"
import { ReactNode } from "react"

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  sub_category: string
  date: string
  image_path: string
}

export interface NewsData {
  topStories: NewsItem[]
  india: NewsItem[]
  world: NewsItem[]
}

async function getNewsByCategory(): Promise<NewsData> {
  const { data: allNews, error } = await supabase
    .from("news")
    .select("*")
    .order('date', { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    return {
      topStories: [],
      india: [],
      world: []
    }
  }

  // Categorize news
  const categorizedNews: NewsData = {
    topStories: allNews.filter(news => news.category === "Top Stories"),
    india: allNews.filter(news => news.category === "India"),
    world: allNews.filter(news => news.category === "World")
  }

  return categorizedNews
}

interface TodayNewsDataProps {
  children: (data: { newsData: NewsData }) => ReactNode
}

export default async function TodayNewsData({ children }: TodayNewsDataProps) {
  const newsData = await getNewsByCategory()
  
  return children({ newsData })
}
