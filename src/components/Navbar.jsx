import { useRef, useEffect } from 'react'

const LEFT  = { x1: 1.72754, y1: 3.23926, x2: 7.3705,  y2: 7.37071 }
const RIGHT = { x1: 10.7466, y1: 3.23926, x2: 16.3895, y2: 7.37071 }
const MAX_R = 3.5

function shapePath(x1, y1, x2, y2, tl, tr, br, bl) {
  const p = []
  p.push(`M ${x1 + tl} ${y1}`)
  p.push(`H ${x2 - tr}`)
  if (tr > 0.001) p.push(`Q ${x2} ${y1} ${x2} ${y1 + tr}`)
  p.push(`V ${y2 - br}`)
  if (br > 0.001) p.push(`Q ${x2} ${y2} ${x2 - br} ${y2}`)
  p.push(`H ${x1 + bl}`)
  if (bl > 0.001) p.push(`Q ${x1} ${y2} ${x1} ${y2 - bl}`)
  p.push(`V ${y1 + tl}`)
  if (tl > 0.001) p.push(`Q ${x1} ${y1} ${x1 + tl} ${y1}`)
  p.push(`Z`)
  return p.join(' ')
}

function InteractiveLogo() {
  const svgRef  = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const curr    = useRef({ tl: 0, tr: MAX_R, br: 0, bl: 0 })
  const tgt     = useRef({ tl: 0, tr: MAX_R, br: 0, bl: 0 })
  const rafId   = useRef(null)

  useEffect(() => {
    const tick = () => {
      const c = curr.current
      const t = tgt.current
      const a = 0.11
      c.tl += (t.tl - c.tl) * a
      c.tr += (t.tr - c.tr) * a
      c.br += (t.br - c.br) * a
      c.bl += (t.bl - c.bl) * a
      const { tl, tr, br, bl } = c
      leftRef.current?.setAttribute('d',  shapePath(LEFT.x1,  LEFT.y1,  LEFT.x2,  LEFT.y2,  tl, tr, br, bl))
      rightRef.current?.setAttribute('d', shapePath(RIGHT.x1, RIGHT.y1, RIGHT.x2, RIGHT.y2, tl, tr, br, bl))
      rafId.current = requestAnimationFrame(tick)
    }
    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const el = svgRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width  / 2)
      const dy = e.clientY - (rect.top  + rect.height / 2)
      const isLeft = dx < 0
      const isTop  = dy < 0
      tgt.current = {
        tl:  !isTop && !isLeft ? MAX_R : 0,
        tr:  !isTop &&  isLeft ? MAX_R : 0,
        br:   isTop &&  isLeft ? MAX_R : 0,
        bl:   isTop && !isLeft ? MAX_R : 0,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const d0 = shapePath(LEFT.x1,  LEFT.y1,  LEFT.x2,  LEFT.y2,  0, MAX_R, 0, 0)
  const d1 = shapePath(RIGHT.x1, RIGHT.y1, RIGHT.x2, RIGHT.y2, 0, MAX_R, 0, 0)

  return (
    <svg
      ref={svgRef}
      width="36"
      height="16"
      viewBox="0 0 18 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: 'pointer', flexShrink: 0 }}
    >
      <path ref={leftRef}  d={d0} fill="#271C11" />
      <path ref={rightRef} d={d1} fill="#271C11" />
      <path d="M0.921875 2.01191C2.03031 1.18897 4.87195 0.0368698 7.37097 2.01191"  stroke="#271C11" strokeWidth="1.8432" strokeLinecap="round" />
      <path d="M10.3433 2.01191C11.4517 1.18897 14.2933 0.0368698 16.7924 2.01191"   stroke="#271C11" strokeWidth="1.8432" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '16px 28px',
        width: '100%',
      }}
    >
      {/* Center — logo pinned to true page center */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <InteractiveLogo />
      </div>

      {/* Right — nav links */}
      <div style={{ display: 'flex', gap: '32px', fontSize: '12px', alignItems: 'center' }}>
        <a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Product</a>
        <a href="#" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>About</a>
        <a
          href="#"
          style={{
            background: 'var(--text-main)',
            color: '#FEFCF9',
            padding: '6px 12px',
            borderRadius: '32px',
            fontWeight: 500,
            fontSize: '12px',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Try Demo
        </a>
      </div>
    </nav>
  )
}
