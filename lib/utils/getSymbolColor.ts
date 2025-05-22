import symbolColors from "@/lib/utils/symboColor.json"

type RGBArray = [number, number, number]

/**
 * Gets the background color for a stock symbol
 * First tries to use the predefined RGB color from symbolColor.json
 * Falls back to a generated Tailwind color if the symbol is not in the JSON
 */

export function getSymbolColor(symbol: string): string {
  // Check if we have a predefined color for this symbol
  if (symbol in symbolColors) {
    const rgbArray = (symbolColors as Record<string, number[]>)[symbol]
    if (Array.isArray(rgbArray) && rgbArray.length === 3) {
      // Convert RGB array to inline style for use in style attribute
      return `rgb(${rgbArray[0]},${rgbArray[1]},${rgbArray[2]})`
    }
  }

  // Fallback to generating a color based on the symbol
  const colors = [
    "rgb(255,0,0)",
    "rgb(0,0,255)",
    "rgb(0,255,0)",
    "rgb(128,0,128)",
    "rgb(255,165,0)",
    "rgb(0,128,128)",
    "rgb(255,192,203)",
    "rgb(75,0,130)",
  ]

  // Simple hash function to get a consistent color for each symbol
  let hash = 0
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
