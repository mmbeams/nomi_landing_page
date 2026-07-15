import { useRef, useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useMobile'
import InvitePopup from './InvitePopup'
import NotchDemo from './NotchDemo'

export default function PopupWidget() {
  const [showPopup, setShowPopup] = useState(false)
  const cardRef = useRef(null)
  const ctaRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const els = [cardRef.current, ctaRef.current]
    els.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(20px)'
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
        setTimeout(() => {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, 800 + i * 150)
      })
    })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: isMobile ? '0 16px' : '0' }}>

      {/* Interactive notch demo — the real product interaction, try it live */}
      <div ref={cardRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <NotchDemo />
      </div>

      {/* CTA buttons */}
      <div ref={ctaRef} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
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
        <button
          style={{
            border: '1px solid var(--text-main)',
            color: 'var(--text-main)',
            background: 'transparent',
            padding: '6px 12px',
            borderRadius: '32px',
            fontWeight: 500,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          How it works
        </button>
      </div>

      <InvitePopup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  )
}
