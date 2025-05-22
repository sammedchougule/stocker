"use client"
import { useState, useEffect, useRef } from "react"
import CustomizedProgressBars from "./CustomizedProgressBars"

interface GaugeProps {
  value: number // Current value (0-100)
}

export default function Gauge({ value }: GaugeProps) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 })

  // Ensure value is within 0-100 range
  const safeValue = Math.min(100, Math.max(0, value))

  // Data for the gauge sections with specific ranges
  const sections = [
    { name: "Extreme Fear", min: 0, max: 30, color: "#22c55e" }, // Green
    { name: "Fear", min: 30, max: 50, color: "#eab308" }, // Yellow
    { name: "Greed", min: 50, max: 70, color: "#f97316" }, // Orange
    { name: "Extreme Greed", min: 70, max: 100, color: "#ef4444" }, // Red
  ]

  // Explanations for each sentiment level
  const sentimentExplanations = {
    "Extreme Fear":
      "Extreme fear (<30) suggests a good time to open fresh positions, as markets are likely to be oversold and might turn upwards.",
    Fear: "Investors are fearful in the market; it means fear is increasing in the market & investors should wait till it reaches Extreme Fear, as that is when the market is expected to turn upwards.",
    Greed:
      "Investors are acting greedy; it means greed is increasing in the market and investors should be cautious in opening new positions.",
    "Extreme Greed":
      "Extreme greed (>70) suggests avoiding fresh positions as markets are overbought and likely to turn downwards.",
  }

  // Calculate the sentiment text based on the value
  const getSentiment = (value: number) => {
    for (const section of sections) {
      if (value >= section.min && value <= section.max) {
        return section.name
      }
    }
    return "Unknown"
  }

  // Calculate the color based on the value
  const getColor = (value: number) => {
    for (const section of sections) {
      if (value >= section.min && value <= section.max) {
        return section.color
      }
    }
    return "#ffffff"
  }

  const sentiment = getSentiment(safeValue)
  const color = getColor(safeValue)

  // Update dimensions when component mounts and on window resize
  useEffect(() => {
    setMounted(true)

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        // Ensure height is properly calculated based on container width
        const height = Math.min(width * 0.7, 300)
        setDimensions({ width, height })
      }
    }

    // Initial update
    updateDimensions()

    // Add resize listener
    window.addEventListener("resize", updateDimensions)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  if (!mounted) {
    return (
      <div ref={containerRef} className="w-full h-64 flex items-center justify-center">
        <CustomizedProgressBars />
      </div>
    )
  }

  // SVG parameters
  const centerX = dimensions.width / 2
  const centerY = dimensions.height * 0.85 // Position center even lower
  const outerRadius = Math.min(dimensions.width * 0.45, dimensions.height * 0.8)
  const innerRadius = outerRadius * 0.75

  // Generate the arcs for the gauge
  const arcs = []
  const markers = [0, 30, 50, 70, 100] // All markers for positioning
  const visibleMarkers = [30, 50, 70] // Only show these markers

  // Calculate start and end angles for the entire gauge (180 degrees, from -180 to 0)
  const startAngle = -180
  const endAngle = 0

  // Generate each section arc
  for (const section of sections) {
    const sectionStartAngle = startAngle + (section.min / 100) * 180
    const sectionEndAngle = startAngle + (section.max / 100) * 180

    // Calculate the SVG arc path
    const startRadians = (sectionStartAngle * Math.PI) / 180
    const endRadians = (sectionEndAngle * Math.PI) / 180

    const startOuterX = centerX + outerRadius * Math.cos(startRadians)
    const startOuterY = centerY + outerRadius * Math.sin(startRadians)
    const endOuterX = centerX + outerRadius * Math.cos(endRadians)
    const endOuterY = centerY + outerRadius * Math.sin(endRadians)

    const startInnerX = centerX + innerRadius * Math.cos(startRadians)
    const startInnerY = centerY + innerRadius * Math.sin(startRadians)
    const endInnerX = centerX + innerRadius * Math.cos(endRadians)
    const endInnerY = centerY + innerRadius * Math.sin(endRadians)

    // Create the arc path
    const largeArcFlag = Math.abs(sectionEndAngle - sectionStartAngle) > 180 ? 1 : 0

    const pathData = [
      `M ${startOuterX} ${startOuterY}`, // Move to start of outer arc
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}`, // Outer arc
      `L ${endInnerX} ${endInnerY}`, // Line to inner arc
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}`, // Inner arc
      "Z", // Close path
    ].join(" ")

    arcs.push({
      path: pathData,
      color: section.color,
    })
  }

  // Replace with:

  // Create a single arc for the entire gauge
  const fullStartAngle = -180
  const fullEndAngle = 0

  const fullStartRadians = (fullStartAngle * Math.PI) / 180
  const fullEndRadians = (fullEndAngle * Math.PI) / 180

  const startOuterX = centerX + outerRadius * Math.cos(fullStartRadians)
  const startOuterY = centerY + outerRadius * Math.sin(fullStartRadians)
  const endOuterX = centerX + outerRadius * Math.cos(fullEndRadians)
  const endOuterY = centerY + outerRadius * Math.sin(fullEndRadians)

  const startInnerX = centerX + innerRadius * Math.cos(fullStartRadians)
  const startInnerY = centerY + innerRadius * Math.sin(fullStartRadians)
  const endInnerX = centerX + innerRadius * Math.cos(fullEndRadians)
  const endInnerY = centerY + innerRadius * Math.sin(fullEndRadians)

  // Create the full arc path
  const largeArcFlag = 1 // Arc is larger than 180 degrees

  const fullPathData = [
    `M ${startOuterX} ${startOuterY}`, // Move to start of outer arc
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endOuterX} ${endOuterY}`, // Outer arc
    `L ${endInnerX} ${endInnerY}`, // Line to inner arc
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startInnerX} ${startInnerY}`, // Inner arc
    "Z", // Close path
  ].join(" ")

  // Calculate needle position (constrained to the semi-circle)
  const needleAngle = Math.max(-180, Math.min(0, -180 + (safeValue / 100) * 180))
  const needleLength = outerRadius * 0.9
  const needleX = centerX + needleLength * Math.cos((needleAngle * Math.PI) / 180)
  const needleY = centerY + needleLength * Math.sin((needleAngle * Math.PI) / 180)

  // Create text path arcs for curved text
  const textPathRadius = outerRadius * 1.08 // Even closer to the gauge

  // Create paths for all four sections
  const textPaths = sections.map((section, index) => {
    const sectionStartAngle = startAngle + (section.min / 100) * 180
    const sectionEndAngle = startAngle + (section.max / 100) * 180
    const midAngle = (sectionStartAngle + sectionEndAngle) / 2

    // For the path, we'll use a slightly wider arc to give enough room for the text
    const pathStartAngle = midAngle - 20
    const pathEndAngle = midAngle + 20

    const pathData = [
      `M ${centerX + textPathRadius * Math.cos((pathStartAngle * Math.PI) / 180)} ${
        centerY + textPathRadius * Math.sin((pathStartAngle * Math.PI) / 180)
      }`,
      `A ${textPathRadius} ${textPathRadius} 0 0 1 ${
        centerX + textPathRadius * Math.cos((pathEndAngle * Math.PI) / 180)
      } ${centerY + textPathRadius * Math.sin((pathEndAngle * Math.PI) / 180)}`,
    ].join(" ")

    return {
      id: `textPath${index}`,
      path: pathData,
      name: section.name,
      color: section.color,
      startOffset: "50%",
    }
  })

  return (
    <div className="w-full flex flex-col items-center">
      <div ref={containerRef} className="w-full aspect-[3/2] relative">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="overflow-visible"
        >
          {/* Define gradients */}
          <defs>
            <linearGradient
              id="gaugeGradient"
              gradientUnits="userSpaceOnUse"
              x1={centerX - outerRadius}
              y1={centerY}
              x2={centerX + outerRadius}
              y2={centerY}
            >
              <stop offset="0%" stopColor="#22c55e" /> {/* Green (Extreme Fear) */}
              <stop offset="30%" stopColor="#eab308" /> {/* Yellow (Fear) */}
              <stop offset="60%" stopColor="#f97316" /> {/* Orange (Greed) */}
              <stop offset="100%" stopColor="#ef4444" /> {/* Red (Extreme Greed) */}
            </linearGradient>

            {/* Gradient for text */}
            <linearGradient
              id="textGradient1"
              gradientUnits="userSpaceOnUse"
              x1={centerX - textPathRadius}
              y1={centerY}
              x2={centerX - textPathRadius / 2}
              y2={centerY}
            >
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <linearGradient
              id="textGradient2"
              gradientUnits="userSpaceOnUse"
              x1={centerX - textPathRadius / 2}
              y1={centerY}
              x2={centerX}
              y2={centerY}
            >
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            <linearGradient
              id="textGradient3"
              gradientUnits="userSpaceOnUse"
              x1={centerX}
              y1={centerY}
              x2={centerX + textPathRadius / 2}
              y2={centerY}
            >
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <linearGradient
              id="textGradient4"
              gradientUnits="userSpaceOnUse"
              x1={centerX + textPathRadius / 2}
              y1={centerY}
              x2={centerX + textPathRadius}
              y2={centerY}
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Full gauge arc with gradient */}
          <path d={fullPathData} fill="url(#gaugeGradient)" />

          {/* Create paths for curved number markers */}
          <defs>
            {markers.map((marker, idx) => {
              const markerAngle = -180 + (marker / 100) * 180
              const pathStartAngle = markerAngle - 10
              const pathEndAngle = markerAngle + 10
              const markerPathRadius = outerRadius * 1.05 // Closer to the gauge

              const pathData = [
                `M ${centerX + markerPathRadius * Math.cos((pathStartAngle * Math.PI) / 180)} ${
                  centerY + markerPathRadius * Math.sin((pathStartAngle * Math.PI) / 180)
                }`,
                `A ${markerPathRadius} ${markerPathRadius} 0 0 1 ${
                  centerX + markerPathRadius * Math.cos((pathEndAngle * Math.PI) / 180)
                } ${centerY + markerPathRadius * Math.sin((pathEndAngle * Math.PI) / 180)}`,
              ].join(" ")

              return <path key={`markerPath${idx}`} id={`markerPath${idx}`} d={pathData} />
            })}
          </defs>

          {/* Curved number markers */}
          {markers.map(
            (marker, idx) =>
              visibleMarkers.includes(marker) && (
                <text key={`marker-${idx}`} fill="#9ca3af" fontSize={dimensions.width * 0.035} fontWeight="bold">
                  <textPath href={`#markerPath${idx}`} startOffset="50%" textAnchor="middle">
                    {marker}
                  </textPath>
                </text>
              ),
          )}

          {/* Paths for curved text (invisible) */}
          <defs>
            {textPaths.map((textPath) => (
              <path key={textPath.id} id={textPath.id} d={textPath.path} />
            ))}
          </defs>

          {/* Curved text for all sections with gradient colors */}
          <text fontSize={dimensions.width * 0.03} fontWeight="bold">
            <textPath href={`#textPath0`} startOffset="50%" textAnchor="middle" fill="url(#textGradient1)">
              {sections[0].name}
            </textPath>
          </text>
          <text fontSize={dimensions.width * 0.03} fontWeight="bold">
            <textPath href={`#textPath1`} startOffset="50%" textAnchor="middle" fill="url(#textGradient2)">
              {sections[1].name}
            </textPath>
          </text>
          <text fontSize={dimensions.width * 0.03} fontWeight="bold">
            <textPath href={`#textPath2`} startOffset="50%" textAnchor="middle" fill="url(#textGradient3)">
              {sections[2].name}
            </textPath>
          </text>
          <text fontSize={dimensions.width * 0.03} fontWeight="bold">
            <textPath href={`#textPath3`} startOffset="50%" textAnchor="middle" fill="url(#textGradient4)">
              {sections[3].name}
            </textPath>
          </text>

          {/* Needle */}
          <circle cx={centerX} cy={centerY} r={outerRadius * 0.05} fill="#3b82f6" stroke="#1e3a8a" strokeWidth="1" />
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#374151"
            strokeWidth={outerRadius * 0.03}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Value and sentiment display */}
      <div className="text-center -mt-4">
        <div className="text-3xl font-bold text-white">{safeValue.toFixed(2)}</div>
        <div className="mt-2 text-center px-4">
          <p className="text-gray-300 text-lg">
            MMI is in the <span style={{ color, fontWeight: "bold" }}>{sentiment}.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
