// GROWING DOTS BACKGROUND - ANIMATED VERSION with particles moving without hovering (mouse effect optional) and optimized for performance using canvas
'use client'

import { useEffect, useRef, useState } from 'react'

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
  animate?: boolean
}

function shouldRenderDot(
  x: number, y: number,
  width: number, height: number,
  centerX: number, centerY: number,
  dotsZone: string,
  noDotsTop: number, noDotsBottom: number
): boolean {
  if (dotsZone === 'full' && (y < noDotsTop || y > noDotsBottom)) return false
  switch (dotsZone) {
    case 'top-half': return y < centerY
    case 'bottom-half': return y > centerY
    case 'top-left': return x < centerX && y < centerY
    case 'top-right': return x > centerX && y < centerY
    case 'bottom-left': return x < centerX && y > centerY
    case 'bottom-right': return x > centerX && y > centerY
    case 'corners': {
      const cs = 0.35
      const l = x < width * cs, r = x > width * (1 - cs)
      const t = y < height * cs, b = y > height * (1 - cs)
      return (l && t) || (r && t) || (l && b) || (r && b)
    }
    case 'center': {
      const mx = width * 0.25, my = height * 0.25
      return x > mx && x < width - mx && y > my && y < height - my
    }
    default: return true
  }
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
  enableMouseEffect = false,
  mouseEffectRadius = 120,
  animate = false
}: GrowingDotsBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let realW = 0, realH = 0

    // Flat typed arrays — zero GC in hot loop
    let homeX: Float32Array
    let homeY: Float32Array
    let posX: Float32Array
    let posY: Float32Array
    let velX: Float32Array
    let velY: Float32Array
    let radii: Float32Array
    // Wander: 2 layered frequencies per axis for organic motion
    let phaseA: Float32Array   // primary phase offset
    let phaseB: Float32Array   // secondary phase offset
    let speedA: Float32Array   // primary speed
    let speedB: Float32Array   // secondary speed (slower, wider)
    let radiusA: Float32Array  // primary wander radius
    let radiusB: Float32Array  // secondary wander radius
    let colorR: Uint8Array
    let colorG: Uint8Array
    let colorB: Uint8Array
    let alphas: Float32Array
    let count = 0

    const buildDots = () => {
      const rect = canvas.getBoundingClientRect()
      realW = rect.width
      realH = rect.height
      canvas.width = realW * dpr
      canvas.height = realH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (realW === 0 || realH === 0) return

      const spacing = 20
      const centerX = realW / 2
      const centerY = realH / 2
      const noDotsTop = (noDotsZone.top || 0) / 100 * realH
      const noDotsBottom = realH - ((noDotsZone.bottom || 0) / 100 * realH)

      // Count
      let n = 0
      for (let x = 0; x < realW; x += spacing) {
        for (let y = 0; y < realH; y += spacing) {
          if (shouldRenderDot(x, y, realW, realH, centerX, centerY, dotsZone, noDotsTop, noDotsBottom)) n++
        }
      }

      // Allocate
      homeX = new Float32Array(n)
      homeY = new Float32Array(n)
      posX = new Float32Array(n)
      posY = new Float32Array(n)
      velX = new Float32Array(n)
      velY = new Float32Array(n)
      radii = new Float32Array(n)
      phaseA = new Float32Array(n)
      phaseB = new Float32Array(n)
      speedA = new Float32Array(n)
      speedB = new Float32Array(n)
      radiusA = new Float32Array(n)
      radiusB = new Float32Array(n)
      colorR = new Uint8Array(n)
      colorG = new Uint8Array(n)
      colorB = new Uint8Array(n)
      alphas = new Float32Array(n)
      count = n

      // Fill
      let i = 0
      for (let x = 0; x < realW; x += spacing) {
        for (let y = 0; y < realH; y += spacing) {
          if (!shouldRenderDot(x, y, realW, realH, centerX, centerY, dotsZone, noDotsTop, noDotsBottom)) continue

          const distFromCenter = Math.abs(y - centerY) / centerY
          // const baseRadius = 5 - distFromCenter * 4.7
          const baseRadius = 3 - distFromCenter * 2.7

          homeX[i] = x
          homeY[i] = y
          posX[i] = x
          posY[i] = y
          radii[i] = baseRadius

          // Two layered sine waves = non-repeating organic drift
          // Primary: faster, tighter
          phaseA[i] = Math.random() * Math.PI * 2
          speedA[i] = 1.0 + Math.random() * 1.4
          radiusA[i] = 2.5 + Math.random() * 3.5

          // Secondary: slower, wider — breaks the circular pattern
          phaseB[i] = Math.random() * Math.PI * 2
          speedB[i] = 0.3 + Math.random() * 0.5
          radiusB[i] = 3 + Math.random() * 5

          // Colors: ~96% gray, ~4% brand red (#FE0503)
          if (Math.random() < 0.04) {
            colorR[i] = 254; colorG[i] = 5; colorB[i] = 3; alphas[i] = 0.25
          } else {
            colorR[i] = 115; colorG[i] = 115; colorB[i] = 115; alphas[i] = 0.3
          }

          i++
        }
      }
    }

    buildDots()

    // Static draw — no animation loop, zero CPU cost
    const drawStatic = () => {
      ctx.clearRect(0, 0, realW, realH)
      for (let i = 0; i < count; i++) {
        ctx.beginPath()
        ctx.arc(homeX[i], homeY[i], radii[i], 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorR[i]},${colorG[i]},${colorB[i]},${alphas[i]})`
        ctx.fill()
      }
    }

    if (!animate) {
      drawStatic()
      // No RAF loop — just a single paint

      let resizeTimer: ReturnType<typeof setTimeout>
      const handleResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => { buildDots(); drawStatic() }, 200)
      }
      window.addEventListener('resize', handleResize)
      return () => {
        clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
      }
    }

    // Animated draw loop
    const SPRING = 0.06
    const DAMPING = 0.88
    const PUSH = 12
    const mouseRadiusSq = mouseEffectRadius * mouseEffectRadius
    let time = 0

    const draw = () => {
      time += 0.016
      ctx.clearRect(0, 0, realW, realH)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (let i = 0; i < count; i++) {
        // Layered wander: two sine waves per axis at different speeds
        const tA = phaseA[i] + time * speedA[i]
        const tB = phaseB[i] + time * speedB[i]
        const rA = radiusA[i]
        const rB = radiusB[i]

        const targetX = homeX[i]
          + Math.cos(tA) * rA                // fast tight orbit
          + Math.sin(tB) * rB                // slow wide drift

        const targetY = homeY[i]
          + Math.sin(tA * 0.8 + 0.5) * rA   // slightly detuned Y
          + Math.cos(tB * 0.6 + 1.2) * rB   // different phase on Y

        // Mouse push
        if (enableMouseEffect) {
          const dx = targetX - mx
          const dy = targetY - my
          const distSq = dx * dx + dy * dy
          if (distSq < mouseRadiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq)
            const force = (1 - dist / mouseEffectRadius) * PUSH
            const angle = Math.atan2(dy, dx)
            velX[i] += Math.cos(angle) * force * 0.15
            velY[i] += Math.sin(angle) * force * 0.15
          }
        }

        // Spring toward wander target
        velX[i] = (velX[i] + (targetX - posX[i]) * SPRING) * DAMPING
        velY[i] = (velY[i] + (targetY - posY[i]) * SPRING) * DAMPING
        posX[i] += velX[i]
        posY[i] += velY[i]

        // Draw
        ctx.beginPath()
        ctx.arc(posX[i], posY[i], radii[i], 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${colorR[i]},${colorG[i]},${colorB[i]},${alphas[i]})`
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    // Mouse events — only when enabled
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    if (enableMouseEffect) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(buildDots, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      if (enableMouseEffect) {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [noDotsZone.top, noDotsZone.bottom, dotsZone, enableMouseEffect, mouseEffectRadius, animate])

  return (
    <div
      className={`absolute inset-0 z-(--z-background) ${className}`}
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease-out' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {showText && (
          <>
            <div className={`absolute ${topPosition} opacity-[0.08] pointer-events-none select-none`}>
              <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
                DOiT
              </span>
            </div>
            <div className={`absolute ${bottomPosition} opacity-[0.08] pointer-events-none select-none`}>
              <span className={`text-graphite font-bold tracking-wider ${textColorClass} ${fontSizeClass} whitespace-nowrap`}>
                DOiT
              </span>
            </div>
          </>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </div>
  )
}

export default GrowingDotsBackground

// GROWING DOTS BACKGROUND - ANIMATED VERSION when mouse moves (optimized for performance)

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
//   enableMouseEffect?: boolean
//   mouseEffectRadius?: number
// }

// const GrowingDotsBackground = ({
//   showText = true,
//   topPosition = "-top-48 -left-8",
//   bottomPosition = "-bottom-48 -right-8",
//   fontSizeClass = "text-[20rem]",
//   textColorClass = "text-neutral-500",
//   noDotsZone = { top: 10, bottom: 10 },
//   dotsZone = 'full',
//   className = "",
//   enableMouseEffect = true,
//   mouseEffectRadius = 120
// }: GrowingDotsBackgroundProps) => {
//   const svgRef = useRef<SVGSVGElement>(null)
//   const dotsDataRef = useRef<Array<{ x: number; y: number; baseRadius: number; element: SVGCircleElement }>>([])

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
//       dotsDataRef.current = []

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
//               const cornerSize = 0.35
              
//               const isInLeftEdge = x < width * cornerSize
//               const isInRightEdge = x > width * (1 - cornerSize)
//               const isInTopEdge = y < height * cornerSize
//               const isInBottomEdge = y > height * (1 - cornerSize)
              
//               const isTopLeft = isInLeftEdge && isInTopEdge
//               const isTopRight = isInRightEdge && isInTopEdge
//               const isBottomLeft = isInLeftEdge && isInBottomEdge
//               const isBottomRight = isInRightEdge && isInBottomEdge
              
//               shouldRender = isTopLeft || isTopRight || isBottomLeft || isBottomRight
//               break

//             case 'center':
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
//           const baseRadius = maxRadius - (distanceFromCenter * (maxRadius - minRadius))
          
//           const opacity = 0.3

//           const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
//           circle.setAttribute('cx', x.toString())
//           circle.setAttribute('cy', y.toString())
//           circle.setAttribute('r', baseRadius.toString())
//           circle.setAttribute('fill', `rgba(115, 115, 115, ${opacity})`)
          
//           svg.appendChild(circle)
          
//           // Store dot data for mouse effect
//           dotsDataRef.current.push({
//             x,
//             y,
//             baseRadius,
//             element: circle
//           })
//         }
//       }
//     }

//     generateDots()
//     window.addEventListener('resize', generateDots)

//     return () => {
//       window.removeEventListener('resize', generateDots)
//     }
//   }, [noDotsZone, dotsZone])

//   // Mouse effect - MINIMAL & FAST
//   useEffect(() => {
//     if (!enableMouseEffect) return

//     let rafId: number

//     const handleMouseMove = (e: MouseEvent) => {
//       if (!svgRef.current) return
      
//       // Throttle with requestAnimationFrame
//       if (rafId) return
      
//       rafId = requestAnimationFrame(() => {
//         const rect = svgRef.current!.getBoundingClientRect()
//         const mouseX = e.clientX - rect.left
//         const mouseY = e.clientY - rect.top
        
//         // Update only nearby dots (much faster)
//         dotsDataRef.current.forEach((dot) => {
//           const dx = mouseX - dot.x
//           const dy = mouseY - dot.y
//           const distance = Math.sqrt(dx * dx + dy * dy)

//           if (distance < mouseEffectRadius) {
//             // Just move dots slightly away
//             const force = (mouseEffectRadius - distance) / mouseEffectRadius
//             const angle = Math.atan2(dy, dx)
//             const pushDistance = force * 10 // max 10px push
            
//             const newX = dot.x + Math.cos(angle) * pushDistance
//             const newY = dot.y + Math.sin(angle) * pushDistance
            
//             dot.element.setAttribute('cx', newX.toString())
//             dot.element.setAttribute('cy', newY.toString())
//           } else if (dot.element.getAttribute('cx') !== dot.x.toString()) {
//             // Reset position if changed
//             dot.element.setAttribute('cx', dot.x.toString())
//             dot.element.setAttribute('cy', dot.y.toString())
//           }
//         })
        
//         rafId = 0 as any
//       })
//     }

//     const handleMouseLeave = () => {
//       // Reset all dots
//       dotsDataRef.current.forEach((dot) => {
//         dot.element.setAttribute('cx', dot.x.toString())
//         dot.element.setAttribute('cy', dot.y.toString())
//       })
//     }

//     window.addEventListener('mousemove', handleMouseMove)
//     window.addEventListener('mouseleave', handleMouseLeave)

//     return () => {
//       if (rafId) cancelAnimationFrame(rafId)
//       window.removeEventListener('mousemove', handleMouseMove)
//       window.removeEventListener('mouseleave', handleMouseLeave)
//     }
//   }, [enableMouseEffect, mouseEffectRadius])

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