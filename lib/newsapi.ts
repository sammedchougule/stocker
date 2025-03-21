const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY
const BASE_URL = "https://newsapi.org/v2"

export async function getTopHeadlines(category?: string, page = 1, pageSize = 10) {
  let url = `${BASE_URL}/top-headlines?country=us&page=${page}&pageSize=10&apiKey=${API_KEY}`

  if (category && category !== "general") {
    url += `&category=${category}`
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch news")
  }
  const data = await response.json()
  return {
    articles: data.articles,
    totalResults: data.totalResults,
  }
}

export async function searchNews(query: string, page = 1) {
  const url = `${BASE_URL}/everything?q=${query}&page=${page}&pageSize=10&apiKey=${API_KEY}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch news")
  }
  const data = await response.json()
  return {
    articles: data.articles,
    totalResults: data.totalResults,
  }
}

export async function getArticleByUrl(encodedTitle: string) {
  const title = decodeURIComponent(encodedTitle)
  const apiUrl = `${BASE_URL}/everything?q=${encodeURIComponent(title)}&apiKey=${API_KEY}`

  console.log("Fetching article from:", apiUrl)

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`API response not OK: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()

    console.log("API response:", data)

    if (data.articles && data.articles.length > 0) {
      // Find the article that best matches the title
      const article =
        data.articles.find((a: any) => a.title.toLowerCase().includes(title.toLowerCase())) || data.articles[0]
      return article
    } else {
      throw new Error("No articles found in API response")
    }
  } catch (error) {
    console.error("Error in getArticleByUrl:", error)
    throw error
  }
}

