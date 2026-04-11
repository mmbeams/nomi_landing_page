import { useState, useRef, useEffect } from 'react'
import { ShiningText } from './ui/shining-text'
import { useIsMobile } from '@/hooks/useMobile'
import InvitePopup from './InvitePopup'

const MODES = ['note', 'task', 'tag']

function LogoMark({ size = 14 }) {
  return (
    <svg width={size} height={size * (8 / 18)} viewBox="0 0 18 8" fill="none">
      <path d="M1.72754 3.23926H3.59563C5.68043 3.23926 7.3705 4.92933 7.3705 7.01413V7.37071H1.72754V3.23926Z" fill="#271C11" />
      <path d="M10.7466 3.23926H12.6147C14.6995 3.23926 16.3895 4.92933 16.3895 7.01413V7.37071H10.7466V3.23926Z" fill="#271C11" />
      <path d="M0.921875 2.01191C2.03031 1.18897 4.87195 0.0368698 7.37097 2.01191" stroke="#271C11" strokeWidth="1.8432" strokeLinecap="round" />
      <path d="M10.3433 2.01191C11.4517 1.18897 14.2933 0.0368698 16.7924 2.01191" stroke="#271C11" strokeWidth="1.8432" strokeLinecap="round" />
    </svg>
  )
}

function TaskIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.5" y="1.5" width="14" height="14" rx="4" stroke="#141B34" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 8.5H11.5M7 11.5H10" stroke="#141B34" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NotepadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <rect x="1.5" y="1" width="14" height="15" rx="4" stroke="#141B34" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="5" y1="6" x2="12" y2="6" stroke="#141B34" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="9.5" x2="10" y2="9.5" stroke="#141B34" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M8.5 13.5V3.5M8.5 3.5L4 8M8.5 3.5L13 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PopupWidget() {
  const [mode, setMode] = useState('note')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState([])
  const [sendPulse, setSendPulse] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const inputRef = useRef(null)
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

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      setMode(prev => MODES[(MODES.indexOf(prev) + 1) % MODES.length])
    }
    if (e.key === 'Enter' && text.trim()) {
      handleSend()
    }
  }

  const handleSend = () => {
    if (!text.trim()) return
    setSubmitted(prev => [{ mode, text, id: Date.now() }, ...prev].slice(0, 5))
    setText('')
    setSendPulse(true)
    setTimeout(() => setSendPulse(false), 300)
    inputRef.current?.focus()
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [mode])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: isMobile ? '0 16px' : '0' }}>

      {/* Popup card */}
      <div
        ref={cardRef}
        onClick={() => inputRef.current?.focus()}
        style={{
          width: '100%',
          maxWidth: '540px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          boxShadow: 'none',
          border: '1px solid rgba(235, 232, 229, 0.5)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '14px 18px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          cursor: 'text',
        }}
      >
        {/* Row 1: Input + Send */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder=""
              autoFocus
              style={{
                width: '100%',
                height: '46px',
                border: 'none',
                outline: 'none',
                fontSize: '17px',
                fontWeight: 400,
                color: '#1F2937',
                background: 'transparent',
                fontFamily: 'Inter, sans-serif',
                caretColor: 'transparent',
                padding: '0',
                lineHeight: '46px',
              }}
            />
            {text.length === 0 && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}>
                <ShiningText
                  text="Capture anything...."
                  className="!text-[17px] !font-normal"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: sendPulse ? '#111' : '#1C1917',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s, transform 0.15s',
              transform: sendPulse ? 'scale(0.93)' : 'scale(1)',
            }}
          >
            <SendIcon />
          </button>
        </div>

        {/* Row 2: Mode tabs */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {/* Note pill */}
          <button
            onClick={() => setMode('note')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px 6px 12px',
              borderRadius: '16px',
              background: mode === 'note' ? `url(${import.meta.env.BASE_URL}mode_bg.png) center/cover no-repeat` : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              color: '#1F2937',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.18s',
            }}
          >
            <LogoMark size={16} />
            Note
          </button>

          {/* Notepad icon */}
          <button
            onClick={() => setMode('task')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: mode === 'task' ? '#4ADE80' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              backdropFilter: mode === 'task' ? 'none' : 'blur(12px)',
              WebkitBackdropFilter: mode === 'task' ? 'none' : 'blur(12px)',
              cursor: 'pointer',
              transition: 'background 0.18s, border 0.18s',
            }}
          >
            <NotepadIcon />
          </button>

          {/* Tag # */}
          <button
            onClick={() => setMode('tag')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: mode === 'tag' ? '#4ADE80' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              backdropFilter: mode === 'tag' ? 'none' : 'blur(12px)',
              WebkitBackdropFilter: mode === 'tag' ? 'none' : 'blur(12px)',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              color: '#1E1E1E',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.18s, border 0.18s',
            }}
          >
            #
          </button>
        </div>
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

      {/* Submitted entries */}
      {submitted.length > 0 && (
        <div style={{ width: '100%', maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {submitted.map(entry => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                border: '1px solid rgba(235, 232, 229, 0.5)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                fontSize: '14px',
                color: 'var(--text-main)',
                fontFamily: 'Inter, sans-serif',
                animation: 'fadeSlideIn 0.25s ease',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#9CA3AF',
                  background: '#F3F4F6',
                  padding: '2px 7px',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              >
                {entry.mode}
              </span>
              {entry.text}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <InvitePopup open={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  )
}
