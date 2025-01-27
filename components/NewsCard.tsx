import Image from "next/image"

interface NewsCardProps {
  title: string
  category: string
  subCategory: string
  imagePath: string
  excerpt: string
  date: string
}

export default function NewsCard({ title, category, subCategory, imagePath, excerpt, date }: NewsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] flex flex-col transition-transform duration-300 transform hover:scale-105">
      <div className="relative h-52">
        <Image src={imagePath || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-blue-600">{category}</span>
          <span className="text-xs text-gray-500">{subCategory}</span>
        </div>
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">{excerpt}</p>
        <p className="text-gray-500 text-xs">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

