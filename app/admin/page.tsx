// app/admin/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import RichTextEditor from "@/components/RichTextEditor"

export default function AdminPage() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Top Stories")
  const [subCategory, setSubCategory] = useState("Business")
  const [image, setImage] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // Set to null initially to indicate loading state
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: user } = await supabase.auth.getUser()

      if (!user) {
        // If not authenticated, redirect to login page
        router.push("/admin/login")
      } else {
        setIsAuthenticated(true)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!image) {
        throw new Error("Please select an image")
      }

      // Upload image
      const fileExt = image.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: imageError } = await supabase.storage.from("news-images").upload(fileName, image)

      if (imageError) {
        throw new Error("Failed to upload image: " + imageError.message)
      }

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("news-images").getPublicUrl(fileName)

      // Insert news article
      const { error: insertError } = await supabase.from("news").insert([{
        title,
        category,
        sub_category: subCategory,
        image_path: publicUrl,
        description,
        excerpt,
      }])

      if (insertError) {
        throw new Error("Failed to add news article: " + insertError.message)
      }

      alert("News article added successfully!")
      // Reset form fields
      setTitle("")
      setCategory("Top Stories")
      setSubCategory("Business")
      setImage(null)
      setDescription("")
      setExcerpt("")
    } catch (error) {
      console.error("Error:", error)
      alert(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (isAuthenticated === null) {
    // Show loading spinner or placeholder while checking authentication
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    // If not authenticated, the user is already redirected in useEffect
    return null
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex">
      <h1 className="flex flex-auto text-2xl font-bold mb-6">Add News Article</h1>
      <button
        onClick={handleLogout}
        className="px-2 bg-red-500 text-white rounded-md hover:bg-red-600">
        Logout
      </button>
      
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">
            Category:
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Top Stories">Top Stories</option>
            <option value="India">India</option>
            <option value="World">World</option>
          </select>
        </div>
        <div>
          <label htmlFor="subCategory" className="block mb-1">
            Sub Category:
          </label>
          <select
            id="subCategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Business">Business</option>
            <option value="Policy">Policy</option>
            <option value="Capital Markets">Capital Markets</option>
            <option value="IPO">IPO</option>
            <option value="Earnings">Earnings</option>
            <option value="Economy">Economy</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block mb-1">
            Image:
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Description:
          </label>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
        <div>
          <label htmlFor="excerpt" className="block mb-1">
            Excerpt:
          </label>
          <input
            type="text"
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding News..." : "Add News"}
        </button>
      </form>
      </div>
  )
}

