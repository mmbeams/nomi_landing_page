import { useEffect, useState, useRef } from 'react'
import { TextParticle } from '@/components/ui/text-particle'

export default function Footer() {
  const nomiRef = useRef(null)
  const [nomiFontSize, setNomiFontSize] = useState(0)

  useEffect(() => {
    const update = () => setNomiFontSize(window.innerWidth * 0.2)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const linkStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 400,
    color: 'var(--text-main)',
    textDecoration: 'none',
    display: 'block',
    lineHeight: 1.8,
  }

  const headingStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-main)',
    marginBottom: '12px',
  }

  return (
    <div
      style={{
        width: '100%',
        padding: '80px 28px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}
    >
      {/* Left — NOMI */}
      <div
        ref={nomiRef}
        style={{
          flexShrink: 0,
          height: `${nomiFontSize * 0.85}px`,
          width: `${nomiFontSize * 2.6}px`,
        }}
      >
        {nomiFontSize > 0 && (
          <TextParticle
            text="NOMI"
            fontSize={nomiFontSize}
            fontFamily="Inter, sans-serif"
            fontWeight={900}
            particleColor="#2D2A26"
            particleSize={2}
            particleDensity={4}
          />
        )}
      </div>

      {/* Right — footer links */}
      <div
        style={{
          display: 'flex',
          gap: '48px',
          paddingBottom: '8px',
        }}
      >
        <div>
          <div style={headingStyle}>Features</div>
          <a href="#" style={linkStyle}>Capture</a>
          <a href="#" style={linkStyle}>Smart Detect</a>
          <a href="#" style={linkStyle}>Smart Organize</a>
          <a href="#" style={linkStyle}>Search</a>
        </div>

        <div>
          <div style={headingStyle}>Resources</div>
          <a href="#" style={linkStyle}>About</a>
          <a href="#" style={linkStyle}>Blog</a>
          <a href="#" style={linkStyle}>Privacy</a>
          <a href="#" style={linkStyle}>Terms</a>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          {/* X / Twitter */}
          <a href="#" style={{ color: 'var(--text-main)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" style={{ color: 'var(--text-main)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" style={{ color: 'var(--text-main)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
