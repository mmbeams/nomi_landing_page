import { useEffect, useRef, useState } from 'react'
import { TextScramble } from './ui/text-scramble'
import InvitePopup from './InvitePopup'

export default function Waitlist() {
  const [triggered, setTriggered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [count, setCount] = useState(2460)
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

  useEffect(() => {
    const handleSignup = () => setCount(c => c + 1)
    window.addEventListener('waitlist-signup', handleSignup)
    return () => window.removeEventListener('waitlist-signup', handleSignup)
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
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
              textAlign: 'center',
            }}
          >
            meet your future study mate<br />join waitlist
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
            {count.toLocaleString()}
          </TextScramble>
        </div>

        <button
          onClick={() => setShowPopup(true)}
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
          Get invite code
        </button>
      </section>

      <InvitePopup open={showPopup} onClose={() => setShowPopup(false)} />
    </>
  )
}
