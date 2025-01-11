// "use client"

// import { useState, useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import Image from 'next/image'

// interface NewsItem {
//   id: number
//   source: string
//   title: string
//   shortDescription: string
//   description: string
//   image: string
//   category: string
// }

// interface NewsData {
//   news: NewsItem[]
// }

// export default function NewsPage() {
//   const [newsData, setNewsData] = useState<NewsData | null>(null)
//   const searchParams = useSearchParams()
//   const id = searchParams.get('id')
//   const category = searchParams.get('category') as string

//   useEffect(() => {
//     const savedData = localStorage.getItem('newsData')
//     if (savedData) {
//       const parsedData = JSON.parse(savedData)
//       setNewsData(parsedData.news)
//     }
//   }, [])

//   if (!newsData || !id || !category) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>
//   }

//   const newsItem = newsData.news.find(item => item.id.toString() === id && item.category === category)

//   if (!newsItem) {
//     return <div className="container mx-auto px-4 py-8">News article not found.</div>
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 mt-24">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold">{newsItem.title}</CardTitle>
//           <p className="text-xl text-gray-600 mt-2">{newsItem.shortDescription}</p>
//           <p className="text-gray-500">Source: {newsItem.source}</p>
//         </CardHeader>
//         <CardContent>
//           {newsItem.image && (
//             <div className="mb-6">
//               <Image
//                 src={newsItem.image}
//                 alt={newsItem.title}
//                 width={800}
//                 height={400}
//                 className="rounded-lg object-cover w-full"
//               />
//             </div>
//           )}
//           <p className="text-lg leading-relaxed">{newsItem.description}</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

