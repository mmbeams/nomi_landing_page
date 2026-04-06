import { useEffect, useRef, useState } from 'react'
import { GradientWaveText } from './ui/gradient-wave-text'

export default function Hero() {
  const subtitle = 'an agentic work assistant help organize all your notes, photos, and links.'
  const line1Ref = useRef(null)
  const line2Ref = useRef(null)
  const tagsRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const els = [line1Ref.current, line2Ref.current, tagsRef.current]
    els.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateX(-30px)'
      el.style.filter = 'blur(8px)'
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease'
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
        el.style.filter = 'blur(0px)'
      }, 150 + i * 250)
    })
  }, [])

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '96px 24px 0',
      }}
    >
      <div
        style={{
          width: '540px',
          textAlign: 'left',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h1
          ref={line1Ref}
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '84px',
            lineHeight: 1,
            marginBottom: '0',
            letterSpacing: '-0.03em',
            opacity: 0,
          }}
        >
          <GradientWaveText
            align="left"
            paused={!hovered}
            repeat={true}
            speed={1.5}
            className="[--gradient-wave-base:#000000]"
          >
            Capture anything,
          </GradientWaveText>
        </h1>

        <div ref={line2Ref} style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', opacity: 0 }}>
          <h1
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '84px',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              margin: 0,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <GradientWaveText
              align="left"
              paused={!hovered}
              repeat={true}
              speed={1.5}
              delay={0.15}
              className="[--gradient-wave-base:#000000]"
            >
              at anytime.
            </GradientWaveText>
          </h1>

          <div
            ref={tagsRef}
            style={{
              opacity: 0,
              paddingBottom: '6px',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                color: 'var(--text-main)',
                letterSpacing: '0.04em',
                lineHeight: 1.3,
                display: 'block',
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
