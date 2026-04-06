import { useEffect, useRef, useState } from 'react'
import { TextScramble } from './ui/text-scramble'

export default function Waitlist() {
  const [triggered, setTriggered] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px',
        gap: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: 'var(--text-main)',
            letterSpacing: '0.04em',
          }}
        >
          people on the waitlist
        </span>
        <TextScramble
          as="span"
          trigger={triggered}
          duration={1.5}
          speed={0.03}
          characterSet="0123456789"
          className=""
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '140px',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
          }}
        >
          2,460
        </TextScramble>
      </div>

      <button
        style={{
          background: 'var(--text-main)',
          color: '#FEFCF9',
          padding: '6px 12px',
          borderRadius: '32px',
          fontWeight: 500,
          fontSize: '12px',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          fontFamily: 'Inter, sans-serif',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Join Waitlist
      </button>
    </section>
  )
}
