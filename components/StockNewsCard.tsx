// import Image from "next/image"
// import Link from "next/link"

// interface StockNewsCardProps {
//   article: {
//     source: {
//       name: string
//     }
//     title: string
//     description: string
//     url: string
//     urlToImage: string
//     publishedAt: string
//   }
// }

// function getTimeAgo(publishedAt: string) {
//   const now = new Date()
//   const published = new Date(publishedAt)
//   const diff = Math.floor((now.getTime() - published.getTime()) / 1000 / 60 / 60)

//   if (diff < 1) return "Just now"
//   if (diff === 1) return "1 hour ago"
//   if (diff < 24) return `${diff} hours ago`
//   return `${Math.floor(diff / 24)} days ago`
// }

// export default function StockNewsCard({ article }: StockNewsCardProps) {
//   const timeAgo = getTimeAgo(article.publishedAt)

//   return (
//     <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
//       <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block">
//         <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
//           <div className="flex items-center mb-2">
//             <div className="flex items-center gap-2">
//               <span className="font-semibold text-gray-700">{article.source.name}</span>
//               <span className="text-gray-500">•</span>
//               <span className="text-gray-500">{timeAgo}</span>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="flex-grow">
//               <h2 className="text-lg font-medium mb-2 line-clamp-3">{article.title}</h2>
//               <p className="text-gray-600 line-clamp-2">{article.description}</p>
//             </div>
//             {article.urlToImage && (
//               <div className="flex-shrink-0">
//                 <Image
//                   src={article.urlToImage || "/placeholder.svg"}
//                   alt={article.title}
//                   width={100}
//                   height={100}
//                   className="rounded-lg object-cover w-[100px] h-[100px]"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   )
// }



import Image from "next/image"
import Link from "next/link"

interface StockNewsCardProps {
  article: {
    source: {
      name: string
    }
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
  }
}

function getTimeAgo(publishedAt: string) {
  const now = new Date()
  const published = new Date(publishedAt)
  const diff = Math.floor((now.getTime() - published.getTime()) / 1000 / 60 / 60)

  if (diff < 1) return "Just now"
  if (diff === 1) return "1 hour ago"
  if (diff < 24) return `${diff} hours ago`
  return `${Math.floor(diff / 24)} days ago`
}

export default function StockNewsCard({ article }: StockNewsCardProps) {
  const timeAgo = getTimeAgo(article.publishedAt)

  return (
    <div className="bg-white dark:bg-[#151719] rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
          <div className="flex items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{article.source.name}</span>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{timeAgo}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-grow">
              <h2 className="text-lg font-medium mb-2 line-clamp-3 text-gray-900 dark:text-white">{article.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{article.description}</p>
            </div>
            {article.urlToImage && (
              <div className="flex-shrink-0">
                <Image
                  src={article.urlToImage || "/placeholder.svg"}
                  alt={article.title}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover w-[100px] h-[100px]"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

