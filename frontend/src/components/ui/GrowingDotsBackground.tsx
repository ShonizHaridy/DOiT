'use client'

import { useEffect, useRef } from 'react'

interface GrowingDotsBackgroundProps {
  showText?: boolean
  topPosition?: string
  bottomPosition?: string
  fontSizeClass?: string
  textColorClass?: string
  noDotsZone?: {
    top?: number
    bottom?: number
  }
  dotsZone?: 'full' | 'top-half' | 'bottom-half' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'corners' | 'center'
  className?: string
  enableMouseEffect?: boolean
  mouseEffectRadius?: number
}

const GrowingDotsBackground = ({
  showText = true,
  topPosition = "-top-48 -left-8",
  bottomPosition = "-bottom-48 -right-8",
  fontSizeClass = "text-[20rem]",
  textColorClass = "text-neutral-500",
  noDotsZone = { top: 10, bottom: 10 },
  dotsZone = 'full',
  className = "",
  enableMouseEffect = true,
  mouseEffectRadius = 120
}: GrowingDotsBackgroundProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const dotsDataRef = useRef<Array<{ x: number; y: number; baseRadius: number; element: SVGCircleElement }>>([])

  useEffect(() => {
    const generateDots = () => {
      if (!svgRef.current) return

      const svg = svgRef.current
      const rect = svg.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const spacing = 20
      const centerY = height / 2
      const centerX = width / 2

      const noDotsTop = (noDotsZone.top || 0) / 100 * height
      const noDotsBottom = height - ((noDotsZone.bottom || 0) / 100 * height)

      svg.innerHTML = ''
      dotsDataRef.current = []

      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          // Apply noDotsZone exclusions (if not using dotsZone)
          if (dotsZone === 'full' && (y < noDotsTop || y > noDotsBottom)) {
            continue
          }

          // Apply dotsZone patterns
          let shouldRender = true

          switch (dotsZone) {
            case 'full':
              shouldRender = true
              break

            case 'top-half':
              shouldRender = y < centerY
              break

            case 'bottom-half':
              shouldRender = y > centerY
              break

            case 'top-left':
              shouldRender = x < centerX && y < centerY
              break

            case 'top-right':
              shouldRender = x > centerX && y < centerY
              break

            case 'bottom-left':
              shouldRender = x < centerX && y > centerY
              break

            case 'bottom-right':
              shouldRender = x > centerX && y > centerY
              break

            case 'corners':
              const cornerSize = 0.35
              
              const isInLeftEdge = x < width * cornerSize
              const isInRightEdge = x > width * (1 - cornerSize)
              const isInTopEdge = y < height * cornerSize
              const isInBottomEdge = y > height * (1 - cornerSize)
              
              const isTopLeft = isInLeftEdge && isInTopEdge
              const isTopRight = isInRightEdge && isInTopEdge
              const isBottomLeft = isInLeftEdge && isInBottomEdge
              const isBottomRight = isInRightEdge && isInBottomEdge
              
              shouldRender = isTopLeft || isTopRight || isBottomLeft || isBottomRight
              break

            case 'center':
              const marginX = width * 0.25
              const marginY = height * 0.25
              shouldRender = x > marginX && x < width - marginX && 
                           y > marginY && y < height - marginY
              break

            default:
              shouldRender = true
          }

          if (!shouldRender) continue

          const distanceFromCenter = Math.abs(y - centerY) / centerY
          
          const minRadius = 0.3
          const maxRadius = 5
          const baseRadius = maxRadius - (distanceFromCenter * (maxRadius - minRadius))
          
          const opacity = 0.3

          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          circle.setAttribute('cx', x.toString())
          circle.setAttribute('cy', y.toString())
          circle.setAttribute('r', baseRadius.toString())
          circle.setAttribute('fill', `rgba(115, 115, 115, ${opacity})`)
          
          svg.appendChild(circle)
          
          // Store dot data for mouse effect
          dotsDataRef.current.push({
            x,
            y,
            baseRadius,
            element: circle
          })
        }
      }
    }

    generateDots()
    window.addEventListener('resize', generateDots)

    return () => {
      window.removeEventListener('resize', generateDots)
    }
  }, [noDotsZone, dotsZone])

  // Mouse effect - MINIMAL & FAST
  useEffect(() => {
    if (!enableMouseEffect) return

    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return
      
      // Throttle with requestAnimationFrame
      if (rafId) return
      
      rafId = requestAnimationFrame(() => {
        const rect = svgRef.current!.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Update only nearby dots (much faster)
        dotsDataRef.current.forEach((dot) => {
          const dx = mouseX - dot.x
          const dy = mouseY - dot.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseEffectRadius) {
            // Just move dots slightly away
            const force = (mouseEffectRadius - distance) / mouseEffectRadius
            const angle = Math.atan2(dy, dx)
            const pushDistance = force * 10 // max 10px push
            
            const newX = dot.x + Math.cos(angle) * pushDistance
            const newY = dot.y + Math.sin(angle) * pushDistance
            
            dot.element.setAttribute('cx', newX.toString())
            dot.element.setAttribute('cy', newY.toString())
          } else if (dot.element.getAttribute('cx') !== dot.x.toString()) {
            // Reset position if changed
            dot.element.setAttribute('cx', dot.x.toString())
            dot.element.setAttribute('cy', dot.y.toString())
          }
        })
        
        rafId = 0 as any
      })
    }

    const handleMouseLeave = () => {
      // Reset all dots
      dotsDataRef.current.forEach((dot) => {
        dot.element.setAttribute('cx', dot.x.toString())
        dot.element.setAttribute('cy', dot.y.toString())
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enableMouseEffect, mouseEffectRadius])

  return (
    <div className={`absolute inset-0 z-(--z-background) ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Conditionally render DOiT text */}
        {showText && (
          <>
            {/* Top DOiT text */}
            <div className={`absolute ${topPosition} opacity-[0.08] pointer-events-none select-none`}>
              <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
                DOiT
              </span>
            </div>

            {/* Bottom DOiT text */}
            <div className={`absolute ${bottomPosition} opacity-[0.08] pointer-events-none select-none`}>
              <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
                DOiT
              </span>
            </div>
          </>
        )}

        {/* GROWING DOTS */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>
    </div>
  )
}

export default GrowingDotsBackground















// // No Animation // Static Dots Version
// 'use client'

// import { useEffect, useRef } from 'react'

// interface GrowingDotsBackgroundProps {
//   showText?: boolean
//   topPosition?: string
//   bottomPosition?: string
//   fontSizeClass?: string
//   textColorClass?: string
//   noDotsZone?: {
//     top?: number
//     bottom?: number
//   }
//   dotsZone?: 'full' | 'top-half' | 'bottom-half' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'corners' | 'center'
//   className?: string
// }

// const GrowingDotsBackground = ({
//   showText = true,
//   topPosition = "-top-48 -left-8",
//   bottomPosition = "-bottom-48 -right-8",
//   fontSizeClass = "text-[20rem]",
//   textColorClass = "text-neutral-500",
//   noDotsZone = { top: 10, bottom: 10 },
//   dotsZone = 'full',
//   className = ""
// }: GrowingDotsBackgroundProps) => {
//   const svgRef = useRef<SVGSVGElement>(null)

//   useEffect(() => {
//     const generateDots = () => {
//       if (!svgRef.current) return

//       const svg = svgRef.current
//       const rect = svg.getBoundingClientRect()
//       const width = rect.width
//       const height = rect.height
//       const spacing = 20
//       const centerY = height / 2
//       const centerX = width / 2

//       const noDotsTop = (noDotsZone.top || 0) / 100 * height
//       const noDotsBottom = height - ((noDotsZone.bottom || 0) / 100 * height)

//       svg.innerHTML = ''

//       for (let x = 0; x < width; x += spacing) {
//         for (let y = 0; y < height; y += spacing) {
//           // Apply noDotsZone exclusions (if not using dotsZone)
//           if (dotsZone === 'full' && (y < noDotsTop || y > noDotsBottom)) {
//             continue
//           }

//           // Apply dotsZone patterns
//           let shouldRender = true

//           switch (dotsZone) {
//             case 'full':
//               shouldRender = true
//               break

//             case 'top-half':
//               shouldRender = y < centerY
//               break

//             case 'bottom-half':
//               shouldRender = y > centerY
//               break

//             case 'top-left':
//               shouldRender = x < centerX && y < centerY
//               break

//             case 'top-right':
//               shouldRender = x > centerX && y < centerY
//               break

//             case 'bottom-left':
//               shouldRender = x < centerX && y > centerY
//               break

//             case 'bottom-right':
//               shouldRender = x > centerX && y > centerY
//               break

//             case 'corners':
//               // Show dots ONLY in the 4 corners (exclude center)
//               const cornerSize = 0.35 // 35% of width/height defines corner area
              
//               const isInLeftEdge = x < width * cornerSize
//               const isInRightEdge = x > width * (1 - cornerSize)
//               const isInTopEdge = y < height * cornerSize
//               const isInBottomEdge = y > height * (1 - cornerSize)
              
//               // Dot appears if it's in a corner (both horizontal AND vertical edge)
//               const isTopLeft = isInLeftEdge && isInTopEdge
//               const isTopRight = isInRightEdge && isInTopEdge
//               const isBottomLeft = isInLeftEdge && isInBottomEdge
//               const isBottomRight = isInRightEdge && isInBottomEdge
              
//               shouldRender = isTopLeft || isTopRight || isBottomLeft || isBottomRight
//               break

//             case 'center':
//               // Only middle area (exclude all corners)
//               const marginX = width * 0.25
//               const marginY = height * 0.25
//               shouldRender = x > marginX && x < width - marginX && 
//                            y > marginY && y < height - marginY
//               break

//             default:
//               shouldRender = true
//           }

//           if (!shouldRender) continue

//           const distanceFromCenter = Math.abs(y - centerY) / centerY
          
//           const minRadius = 0.3
//           const maxRadius = 5
//           const radius = maxRadius - (distanceFromCenter * (maxRadius - minRadius))
          
//           const opacity = 0.3

//           const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
//           circle.setAttribute('cx', x.toString())
//           circle.setAttribute('cy', y.toString())
//           circle.setAttribute('r', radius.toString())
//           circle.setAttribute('fill', `rgba(115, 115, 115, ${opacity})`)
          
//           svg.appendChild(circle)
//         }
//       }
//     }

//     generateDots()
//     window.addEventListener('resize', generateDots)

//     return () => {
//       window.removeEventListener('resize', generateDots)
//     }
//   }, [noDotsZone, dotsZone])

//   return (
//     <div className={`absolute inset-0 z-(--z-background) ${className}`}>
//       <div className="absolute inset-0 overflow-hidden">
//         {/* Conditionally render DOiT text */}
//         {showText && (
//           <>
//             {/* Top DOiT text */}
//             <div className={`absolute ${topPosition} opacity-[0.08] pointer-events-none select-none`}>
//               <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
//                 DOiT
//               </span>
//             </div>

//             {/* Bottom DOiT text */}
//             <div className={`absolute ${bottomPosition} opacity-[0.08] pointer-events-none select-none`}>
//               <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
//                 DOiT
//               </span>
//             </div>
//           </>
//         )}

//         {/* GROWING DOTS */}
//         <svg
//           ref={svgRef}
//           className="absolute inset-0 w-full h-full pointer-events-none"
//           xmlns="http://www.w3.org/2000/svg"
//         />
//       </div>
//     </div>
//   )
// }

// export default GrowingDotsBackground