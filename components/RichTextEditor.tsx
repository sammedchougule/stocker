import type React from "react"
import { useState, useRef, useEffect } from "react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")

  // Font options
  const fontSizes = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px"]
  const fontFamilies = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Courier New", "Verdana"]

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
      // Set cursor at the end
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [value])

  const handleChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      onChange(content)
      // Maintain cursor position
      const sel = window.getSelection()
      if (sel?.rangeCount) {
        const range = sel.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(editorRef.current)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        const caretOffset = preCaretRange.toString().length
        requestAnimationFrame(() => {
          setCaretPosition(editorRef.current!, caretOffset)
        })
      }
    }
  }

  const execCommand = (e: React.MouseEvent, command: string, value: string | undefined = undefined) => {
    e.preventDefault()
    document.execCommand(command, false, value)

    // Reset direction to LTR after any command
    if (editorRef.current) {
      editorRef.current.setAttribute("dir", "ltr")
    }

    handleChange()
    editorRef.current?.focus()
  }

  const handleLinkInsert = (e: React.MouseEvent) => {
    e.preventDefault()
    if (linkUrl.trim()) {
      execCommand(e, "createLink", linkUrl)
      setShowLinkInput(false)
      setLinkUrl("")
    } else {
      alert("URL cannot be empty.")
    }
  }

  const handleImageInsert = (e: React.MouseEvent) => {
    e.preventDefault()
    const imageUrl = prompt("Enter image URL:")
    if (imageUrl && imageUrl.trim() !== "") {
      execCommand(e, "insertImage", imageUrl)
    } else {
      alert("Image URL cannot be empty.")
    }
  }

  const setFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value
    if (editorRef.current) {
      document.execCommand("styleWithCSS", false, "true")
      document.execCommand("fontSize", false, "7") // Temporarily set to the largest size
      const fontElements = editorRef.current.querySelectorAll("font[size='7']")
      fontElements.forEach((el) => {
        const htmlElement = el as HTMLElement
        htmlElement.removeAttribute("size")
        htmlElement.style.fontSize = size
      })
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 p-2 flex flex-wrap gap-2 items-center border-b">
        {/* Text formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            type="button"
            onClick={(e) => execCommand(e, "bold")}
            className="p-1 hover:bg-gray-200 rounded min-w-[28px]"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={(e) => execCommand(e, "italic")}
            className="p-1 hover:bg-gray-200 rounded min-w-[28px]"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={(e) => execCommand(e, "underline")}
            className="p-1 hover:bg-gray-200 rounded min-w-[28px]"
            title="Underline"
          >
            <u>U</u>
          </button>
        </div>

        {/* Font size and family */}
        {/* <div className="flex gap-2 border-r pr-2">
          <select onChange={setFontSize} className="px-2 py-1 rounded border bg-white" title="Font Size">
            <option value="">Font Size</option>
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => execCommand(e, "fontName", e.target.value)}
            className="px-2 py-1 rounded border bg-white"
            title="Font Family"
          >
            <option value="">Font Family</option>
            {fontFamilies.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div> */}

        {/* Insert options */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setShowLinkInput(true)
            }}
            className="p-1 hover:bg-gray-200 rounded px-2"
            title="Insert Link"
          >
            Link
          </button>
          <button
            type="button"
            onClick={handleImageInsert}
            className="p-1 hover:bg-gray-200 rounded px-2"
            title="Insert Image"
          >
            Image
          </button>
          <button
            type="button"
            onClick={(e) => execCommand(e, "insertHorizontalRule")}
            className="p-1 hover:bg-gray-200 rounded px-2"
            title="Insert Horizontal Line"
          >
            HR
          </button>
        </div>
      </div>

      {showLinkInput && (
        <div className="bg-gray-100 p-2 flex border-b">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-grow px-2 py-1 rounded-l-md border-0"
          />
          <button
            type="button"
            onClick={handleLinkInsert}
            className="bg-blue-500 text-white px-4 py-1 rounded-r-md hover:bg-blue-600"
          >
            Insert
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        className="p-4 min-h-[200px] focus:outline-none whitespace-pre-wrap"
        style={{
          textAlign: "left",
        }}
        dir="ltr"
      />
    </div>
  )
}

const setCaretPosition = (element: HTMLElement, offset: number) => {
  const range = document.createRange()
  const sel = window.getSelection()
  range.setStart(element, 0)
  range.collapse(true)
  let currentOffset = 0
  const nodeStack = [element]
  let node
  let foundStart = false
  while (!foundStart && (node = nodeStack.pop())) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nextOffset = currentOffset + node.textContent!.length
      if (nextOffset >= offset) {
        range.setStart(node, offset - currentOffset)
        foundStart = true
      } else {
        currentOffset = nextOffset
      }
    } else {
      let i = node.childNodes.length
      while (i--) {
        nodeStack.push(node.childNodes[i] as HTMLElement)
      }
    }
  }
  sel?.removeAllRanges()
  sel?.addRange(range)
}

