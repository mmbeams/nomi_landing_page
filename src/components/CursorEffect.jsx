import { useEffect, useRef } from 'react'

const COLORS = ['#01FA92', '#01FA92', '#01FA92', '#80FFCA', '#FFFFFF']

export default function CursorEffect() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const spawn = (x, y, count = 3) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.2
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1.0,
          decay: 0.035 + Math.random() * 0.04,
          size: Math.random() < 0.4 ? 12 : 8,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
    }

    let mouse = { x: -1000, y: -1000, onScreen: false }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.onScreen = true
    }
    const onLeave = () => { mouse.onScreen = false }
    const onEnter = () => { mouse.onScreen = true }

    const draw = () => {
      // Always emit at current cursor position when on screen
      if (mouse.onScreen) spawn(mouse.x, mouse.y, 2)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles = particles.filter(p => p.life > 0.02)

      for (const p of particles) {
        ctx.globalAlpha = Math.pow(p.life, 1.5)
        ctx.fillStyle = p.color
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.life -= p.decay
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
