import React from "react"

interface CustomTreemapContentProps {
  x: number
  y: number
  width: number
  height: number
  name: string
  color: string
  image?: string
  changepct: number
  price: number
  onClick: (name: string) => void
}

export const CustomTreemapContent: React.FC<CustomTreemapContentProps> = ({
  x,
  y,
  width,
  height,
  name,
  color,
  image,
  changepct,
  price,
  onClick,
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        fill: color,
        stroke: "#fff",
        cursor: "pointer",
        transition: "fill 0.4s ease-out",
      }}
      onClick={() => onClick(name)}
    />

    {image && (
      <g>
        <defs>
          <clipPath id={`clip-${name}`}>
            <circle cx={x + width / 2} cy={y + height / 4} r={Math.min(width, height) / 8} />
          </clipPath>
        </defs>
        <image
          x={x + width / 2 - Math.min(width, height) / 8}
          y={y + height / 4 - Math.min(width, height) / 8}
          width={Math.min(width, height) / 4}
          height={Math.min(width, height) / 4}
          href={image}
          clipPath={`url(#clip-${name})`}
          style={{ pointerEvents: "none" }}
        />
      </g>
    )}

    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      fontSize={Math.min(width / 8, 16)}
    >
      {name}
    </text>
    <text
      x={x + width / 2}
      y={y + height / 2 + 16}
      fill="#fff"
      textAnchor="middle"
      fontSize={Math.min(width / 10, 14)}
    >
      ₹{Number(price).toFixed(2)}
    </text>
    <text
      x={x + width / 2}
      y={y + height / 2 + 30}
      fill="#fff"
      textAnchor="middle"
      fontSize={Math.min(width / 10, 12)}
    >
      {Number(changepct).toFixed(2)}%
    </text>
  </g>
)
