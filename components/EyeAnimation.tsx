'use client'

import React, { useEffect, useRef } from 'react'

const EyeAnimation: React.FC = () => {
  const eyesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const eyes = eyesRef.current
      if (!eyes) return

      const eyesRect = eyes.getBoundingClientRect()
      const eyeCenterX = eyesRect.left + eyesRect.width / 2
      const eyeCenterY = eyesRect.top + eyesRect.height / 2

      const angle = Math.atan2(event.clientY - eyeCenterY, event.clientX - eyeCenterX)
      const distance = Math.min(
        eyesRect.width / 10,
        Math.hypot(event.clientX - eyeCenterX, event.clientY - eyeCenterY)
      )

      const pupilX = Math.cos(angle) * distance
      const pupilY = Math.sin(angle) * distance

      const pupils = eyes.querySelectorAll('.pupil') as NodeListOf<SVGCircleElement>
      pupils.forEach((pupil) => {
        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`
      })
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <svg ref={eyesRef} width="32" height="18" viewBox="0 0 100 50" className="eyes">
      <style>
        {`
          @keyframes blink {
            0%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
          }
          .eyelid {
            animation: blink 4s infinite;
          }
        `}
      </style>
      <defs>
        <radialGradient id="irisGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#7eb6ff" />
          <stop offset="90%" stopColor="#2f7bff" />
          <stop offset="100%" stopColor="#0056ff" />
        </radialGradient>
        <filter id="shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
          <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform="translate(25, 25)">
        <circle cx="0" cy="0" r="20" fill="white" stroke="#00000030" strokeWidth="1" filter="url(#shadow)" />
        <circle cx="0" cy="0" r="11" fill="url(#irisGradient)" />
        <circle className="pupil" cx="0" cy="0" r="5" fill="#000000" />
        <circle cx="-7" cy="-7" r="4" fill="#ffffff80" />
        <path className="eyelid" d="M -20 0 Q 0 -25 20 0" fill="none" stroke="#00000030" strokeWidth="1" />
      </g>
      <g transform="translate(75, 25)">
        <circle cx="0" cy="0" r="20" fill="white" stroke="#00000030" strokeWidth="1" filter="url(#shadow)" />
        <circle cx="0" cy="0" r="11" fill="url(#irisGradient)" />
        <circle className="pupil" cx="0" cy="0" r="5" fill="#000000" />
        <circle cx="-7" cy="-7" r="4" fill="#ffffff80" />
        <path className="eyelid" d="M -20 0 Q 0 -25 20 0" fill="none" stroke="#00000030" strokeWidth="1" />
      </g>
    </svg>
  )
}

export default EyeAnimation

