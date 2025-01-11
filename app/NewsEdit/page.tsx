// "use client"

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/buttons"
// import { Label } from "@/components/ui/label"
// import { PlusCircle, MinusCircle, Upload } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'
// import Image from '@tiptap/extension-image'

// interface NewsItem {
//   id: number
//   category: 'topStories' | 'localMarket' | 'worldMarkets'
//   title: string
//   shortDescription: string
//   description: string
//   image: string
// }

// interface EarningsItem {
//   date: string
//   company: string
// }

// interface FormData {
//   news: NewsItem[]
//   earnings: EarningsItem[]
// }

// const initialFormData: FormData = {
//   news: [],
//   earnings: [{ date: '', company: '' }],
// }

// const RichTextEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Image,
//     ],
//     content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML())
//     },
//   })

//   return <EditorContent editor={editor} className="border rounded-md p-2 min-h-[200px]" />
// }

// export default function NewsEdit() {
//   const [formData, setFormData] = useState<FormData>(initialFormData)

//   useEffect(() => {
//     const savedData = localStorage.getItem('newsData')
//     if (savedData) {
//       setFormData(JSON.parse(savedData))
//     }
//   }, [])

//   const handleNewsChange = (index: number, field: keyof NewsItem, value: string) => {
//     setFormData(prevData => ({
//       ...prevData,
//       news: prevData.news.map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       ),
//     }))
//   }

//   const handleEarningsChange = (index: number, field: keyof EarningsItem, value: string) => {
//     setFormData(prevData => ({
//       ...prevData,
//       earnings: prevData.earnings.map((item, i) => 
//         i === index ? { ...item, [field]: value } : item
//       ),
//     }))
//   }

//   const addNewsItem = () => {
//     setFormData(prevData => ({
//       ...prevData,
//       news: [
//         ...prevData.news,
//         { id: Date.now(), category: 'topStories', title: '', shortDescription: '', description: '', image: '' },
//       ],
//     }))
//   }

//   const removeNewsItem = (index: number) => {
//     setFormData(prevData => ({
//       ...prevData,
//       news: prevData.news.filter((_, i) => i !== index),
//     }))
//   }

//   const addEarningsItem = () => {
//     setFormData(prevData => ({
//       ...prevData,
//       earnings: [...prevData.earnings, { date: '', company: '' }],
//     }))
//   }

//   const removeEarningsItem = (index: number) => {
//     setFormData(prevData => ({
//       ...prevData,
//       earnings: prevData.earnings.filter((_, i) => i !== index),
//     }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     localStorage.setItem('newsData', JSON.stringify(formData))
//     alert('Data saved successfully!')
//   }

//   const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         handleNewsChange(index, 'image', reader.result as string)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Edit News and Earnings Data</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>News Section</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {formData.news.map((item, index) => (
//                 <div key={item.id} className="mb-4 p-4 border rounded">
//                   <div className="flex justify-between items-center mb-2">
//                     <h4 className="text-lg font-semibold">News Item {index + 1}</h4>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeNewsItem(index)}
//                     >
//                       <MinusCircle className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="grid gap-4">
//                     <div>
//                       <Label htmlFor={`news-${index}-category`}>Category</Label>
//                       <Select
//                         value={item.category}
//                         onValueChange={(value) => handleNewsChange(index, 'category', value as 'topStories' | 'localMarket' | 'worldMarkets')}
//                       >
//                         <SelectTrigger id={`news-${index}-category`}>
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="topStories">Top Stories</SelectItem>
//                           <SelectItem value="localMarket">Local Market</SelectItem>
//                           <SelectItem value="worldMarkets">World Markets</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <Label htmlFor={`news-${index}-title`}>Title</Label>
//                       <Input
//                         id={`news-${index}-title`}
//                         value={item.title}
//                         onChange={(e) => handleNewsChange(index, 'title', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`news-${index}-shortDescription`}>Short Description</Label>
//                       <Input
//                         id={`news-${index}-shortDescription`}
//                         value={item.shortDescription}
//                         onChange={(e) => handleNewsChange(index, 'shortDescription', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`news-${index}-description`}>Description</Label>
//                       <RichTextEditor
//                         content={item.description}
//                         onChange={(content) => handleNewsChange(index, 'description', content)}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`news-${index}-image`}>Image</Label>
//                       <div className="flex items-center gap-2">
//                         <Input
//                           id={`news-${index}-image`}
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleImageUpload(index, e)}
//                           className="hidden"
//                         />
//                         <Button
//                           variant="outline"
//                           onClick={() => document.getElementById(`news-${index}-image`)?.click()}
//                         >
//                           <Upload className="h-4 w-4 mr-2" /> Upload Image
//                         </Button>
//                         {item.image && <span className="text-sm text-green-600">Image uploaded</span>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <Button onClick={addNewsItem} className="w-full">
//                 <PlusCircle className="h-4 w-4 mr-2" /> Add News Item
//               </Button>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Earnings Calendar</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {formData.earnings.map((item, index) => (
//                 <div key={index} className="mb-4 p-4 border rounded">
//                   <div className="flex justify-between items-center mb-2">
//                     <h4 className="text-lg font-semibold">Item {index + 1}</h4>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeEarningsItem(index)}
//                     >
//                       <MinusCircle className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="grid gap-4">
//                     <div>
//                       <Label htmlFor={`earnings-${index}-date`}>Date</Label>
//                       <Input
//                         id={`earnings-${index}-date`}
//                         type="date"
//                         value={item.date}
//                         onChange={(e) => handleEarningsChange(index, 'date', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <Label htmlFor={`earnings-${index}-company`}>Company</Label>
//                       <Input
//                         id={`earnings-${index}-company`}
//                         value={item.company}
//                         onChange={(e) => handleEarningsChange(index, 'company', e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <Button onClick={addEarningsItem} className="w-full">
//                 <PlusCircle className="h-4 w-4 mr-2" /> Add Earnings Item
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//         <Button type="submit" className="mt-6">Save Changes</Button>
//       </form>
//     </div>
//   )
// }

