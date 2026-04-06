'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

type Particle = {
    x: number; y: number; originalX: number; originalY: number
    previousX: number; previousY: number; color: string
    opacity: number; originalAlpha: number
    velocityX: number; velocityY: number; angle: number; speed: number
    shouldFadeQuickly?: boolean; scale: number; rotation: number
    rotationSpeed: number; hue: number; saturation: number
    lightness: number; turbulence: number
}

type VaporizeAnimationTextProps = {
    texts?: string[]
    fontSize?: string
    fontFamily?: string
    fontWeight?: number
    color?: string
    letterSpacing?: string
    className?: string
    hoverOnly?: boolean
}

export function VaporizeAnimationText({
    texts = ["Cool"],
    fontSize = "70px",
    fontFamily = "Inter, sans-serif",
    fontWeight = 600,
    color = "rgb(255, 255, 255)",
    letterSpacing = "0em",
    className,
    hoverOnly = false,
}: VaporizeAnimationTextProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationFrameRef = useRef<number | null>(null)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [animationState, setAnimationState] = useState<"static" | "vaporizing" | "fadingIn" | "waiting">("static")
    const vaporizeProgressRef = useRef(0)
    const fadeOpacityRef = useRef(0)
    const isHoveredRef = useRef(false)

    const config = useMemo(() => ({
        color,
        font: { fontFamily, fontSize, fontWeight },
        animation: { vaporizeDuration: 2000, fadeInDuration: 1000, waitDuration: 500 },
        direction: "left-to-right" as const,
        spread: 5, density: 5,
        effects: {
            turbulence: 0.3, colorShift: true, rotation: true,
            scale: true, glow: true, trail: true, gravity: 0.1, bounce: 0.8
        }
    }), [color, fontFamily, fontSize, fontWeight])

    const triggerVaporize = useCallback(() => {
        if (animationState === "static" || animationState === "waiting") {
            vaporizeProgressRef.current = 0
            setAnimationState("vaporizing")
        }
    }, [animationState])

    const handleMouseEnter = useCallback(() => {
        isHoveredRef.current = true
        if (hoverOnly) triggerVaporize()
    }, [hoverOnly, triggerVaporize])

    const handleMouseLeave = useCallback(() => {
        isHoveredRef.current = false
    }, [])

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const updateCanvasSize = () => {
            const { width, height } = containerRef.current!.getBoundingClientRect()
            canvas.width = width
            canvas.height = height
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
        }
        updateCanvasSize()

        const createParticles = (text: string) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = config.color
            ctx.font = `${config.font.fontWeight} ${config.font.fontSize} ${config.font.fontFamily}`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            if ((ctx as any).letterSpacing !== undefined) {
                (ctx as any).letterSpacing = letterSpacing
            }
            ctx.fillText(text, canvas.width / 2, canvas.height / 2)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            const particles: Particle[] = []
            const sampleRate = 4

            for (let y = 0; y < canvas.height; y += sampleRate) {
                for (let x = 0; x < canvas.width; x += sampleRate) {
                    const index = (y * canvas.width + x) * 4
                    const alpha = data[index + 3]
                    if (alpha > 0) {
                        particles.push({
                            x, y, originalX: x, originalY: y, previousX: x, previousY: y,
                            color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, ${alpha / 255})`,
                            opacity: alpha / 255, originalAlpha: alpha / 255,
                            velocityX: 0, velocityY: 0,
                            angle: Math.random() * Math.PI * 2, speed: 0,
                            scale: 1, rotation: Math.random() * Math.PI * 2,
                            rotationSpeed: (Math.random() - 0.5) * 0.2,
                            hue: 0, saturation: 0, lightness: 100,
                            turbulence: Math.random() * config.effects.turbulence
                        })
                    }
                }
            }

            particlesRef.current = particles
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        const drawGlow = (x: number, y: number, radius: number, clr: string) => {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
            gradient.addColorStop(0, clr)
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fill()
        }

        const drawTrail = (particle: Particle) => {
            ctx.beginPath()
            ctx.moveTo(particle.previousX, particle.previousY)
            ctx.lineTo(particle.x, particle.y)
            ctx.strokeStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity * 0.3})`)
            ctx.lineWidth = 1
            ctx.stroke()
        }

        let lastTime = performance.now()
        const animate = (currentTime: number) => {
            const deltaTime = (currentTime - lastTime) / 1000
            lastTime = currentTime
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            switch (animationState) {
                case "vaporizing": {
                    vaporizeProgressRef.current += deltaTime * 100
                    const progress = Math.min(100, vaporizeProgressRef.current)
                    let allVaporized = true

                    particlesRef.current.forEach(particle => {
                        const shouldVaporize = particle.originalX <= canvas.width * progress / 100
                        if (shouldVaporize) {
                            if (particle.speed === 0) {
                                particle.speed = Math.random() * config.spread + 2
                                particle.angle = Math.random() * Math.PI * 2
                                particle.velocityX = Math.cos(particle.angle) * particle.speed
                                particle.velocityY = Math.sin(particle.angle) * particle.speed
                                particle.shouldFadeQuickly = Math.random() > config.density / 10
                            }
                            particle.velocityY += config.effects.gravity
                            particle.velocityX *= 0.98; particle.velocityY *= 0.98
                            particle.velocityX += (Math.random() - 0.5) * particle.turbulence * 0.5
                            particle.velocityY += (Math.random() - 0.5) * particle.turbulence * 0.5
                            particle.previousX = particle.x; particle.previousY = particle.y
                            particle.x += particle.velocityX; particle.y += particle.velocityY
                            if (particle.x < -50 || particle.x > canvas.width + 50 || particle.y < -50 || particle.y > canvas.height + 50) particle.opacity = 0
                            particle.opacity *= particle.shouldFadeQuickly ? 0.95 : 0.98
                            if (particle.opacity > 0.01) allVaporized = false
                            if (particle.opacity > 0.01) {
                                if (config.effects.trail) drawTrail(particle)
                                ctx.save()
                                ctx.translate(particle.x, particle.y)
                                ctx.rotate(particle.rotation)
                                ctx.scale(particle.scale, particle.scale)
                                const pc = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
                                ctx.fillStyle = pc; ctx.fillRect(-1, -1, 2, 2)
                                if (config.effects.glow) drawGlow(0, 0, 4, pc)
                                ctx.restore()
                            }
                        } else {
                            allVaporized = false
                            ctx.fillStyle = particle.color; ctx.fillRect(particle.x, particle.y, 2, 2)
                        }
                    })

                    if (progress >= 100 && allVaporized) {
                        particlesRef.current = []
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        const nextIndex = (currentTextIndex + 1) % texts.length
                        setCurrentTextIndex(nextIndex)
                        createParticles(texts[nextIndex])
                        setAnimationState("fadingIn")
                        fadeOpacityRef.current = 0
                    }
                    break
                }
                case "fadingIn": {
                    fadeOpacityRef.current += deltaTime * 2
                    const opacity = Math.min(1, fadeOpacityRef.current)
                    particlesRef.current.forEach(particle => {
                        particle.x = particle.originalX; particle.y = particle.originalY
                        particle.opacity = opacity * particle.originalAlpha
                        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
                        ctx.fillRect(particle.x, particle.y, 2, 2)
                        if (config.effects.glow) drawGlow(particle.x, particle.y, 2, particle.color.replace(/[\d.]+\)$/, `${particle.opacity * 0.5})`))
                    })
                    if (opacity >= 1) {
                        if (hoverOnly) {
                            // Go back to static, wait for next hover
                            setAnimationState("static")
                        } else {
                            setAnimationState("waiting")
                            setTimeout(() => {
                                setAnimationState("vaporizing")
                                vaporizeProgressRef.current = 0
                            }, config.animation.waitDuration)
                        }
                    }
                    break
                }
                case "waiting":
                case "static":
                default: {
                    // Draw solid text instead of particles for crisp rendering
                    ctx.fillStyle = config.color
                    ctx.font = `${config.font.fontWeight} ${config.font.fontSize} ${config.font.fontFamily}`
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    if ((ctx as any).letterSpacing !== undefined) {
                        (ctx as any).letterSpacing = letterSpacing
                    }
                    ctx.fillText(texts[currentTextIndex], canvas.width / 2, canvas.height / 2)
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        createParticles(texts[currentTextIndex])
        if (!hoverOnly) {
            setTimeout(() => setAnimationState("vaporizing"), 1000)
        }
        animationFrameRef.current = requestAnimationFrame(animate)
        window.addEventListener('resize', updateCanvasSize)

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
            window.removeEventListener('resize', updateCanvasSize)
        }
    }, [config, texts, currentTextIndex, animationState, hoverOnly, letterSpacing])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}
