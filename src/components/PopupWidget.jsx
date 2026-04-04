import { useState, useRef, useEffect } from 'react'

const MODES = ['note', 'task', 'tag']

const PLACEHOLDERS = {
  note: 'Capture anything....',
  task: 'What needs to be done?',
  tag:  'Add a tag...',
}

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
      <rect x="1.5" y="1.5" width="14" height="14" rx="3" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M152.667 92.3333H147.333M151 95.6666H149" transform="translate(-143.333,-84.333) scale(1)" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NotepadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 14 16" fill="none">
      <rect x="0.5" y="0.5" width="13" height="15" rx="3" stroke="#141B34" strokeWidth="1" />
      <line x1="3.5" y1="5" x2="10.5" y2="5" stroke="#141B34" strokeWidth="1" strokeLinecap="round" />
      <line x1="3.5" y1="8" x2="8.5" y2="8" stroke="#141B34" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M3.5 13.5L13.5 3.5M13.5 3.5H6.5M13.5 3.5V10.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PopupWidget() {
  const [mode, setMode] = useState('note')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState([])
  const [sendPulse, setSendPulse] = useState(false)
  const [focused, setFocused] = useState(false)
  const [cursorX, setCursorX] = useState(0)
  const inputRef = useRef(null)
  const measureRef = useRef(null)

  useEffect(() => {
    if (measureRef.current) {
      measureRef.current.textContent = text || ''
      setCursorX(measureRef.current.offsetWidth)
    }
  }, [text])

  const cycleMode = () => {
    setMode(prev => MODES[(MODES.indexOf(prev) + 1) % MODES.length])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      cycleMode()
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

      {/* Popup card — rx=32 from popup.svg, stroke=#EBE8E5 */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          width: '540px',
          background: '#FFFFFF',
          borderRadius: '32px',
          boxShadow: 'none',
          border: '1px solid #EBE8E5',
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
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={text.length > 0 ? '' : PLACEHOLDERS[mode]}
              autoFocus
              className="popup-input"
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
            <span
              ref={measureRef}
              aria-hidden="true"
              style={{
                position: 'absolute',
                visibility: 'hidden',
                whiteSpace: 'pre',
                fontSize: '17px',
                fontWeight: 400,
                fontFamily: 'Inter, sans-serif',
                pointerEvents: 'none',
              }}
            />
            {focused && (
              <span className="typing-cursor" style={{ position: 'absolute', left: `${cursorX + 2}px` }} />
            )}
          </div>
          <button
            onClick={handleSend}
            style={{
              width: '46px',
              height: '46px',
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

        {/* Row 2: Mode tabs — rx=16 from popup.svg */}
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

          {/* Notepad icon — matches popup.svg circle buttons */}
          <button
            onClick={() => setMode('task')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '16px',
              background: mode === 'task' ? '#4ADE80' : '#FFFFFF',
              border: mode === 'task' ? 'none' : '0.5px solid rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'background 0.18s, border 0.18s',
            }}
          >
            <NotepadIcon />
          </button>

          {/* Tag # — matches popup.svg circle buttons */}
          <button
            onClick={() => setMode('tag')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '16px',
              background: mode === 'tag' ? '#4ADE80' : '#FFFFFF',
              border: mode === 'tag' ? 'none' : '0.5px solid rgba(0,0,0,0.2)',
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

      {/* Submitted entries */}
      {submitted.length > 0 && (
        <div style={{ width: '540px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {submitted.map(entry => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EBE8E5',
                fontSize: '14px',
                color: '#374151',
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
        .popup-input::placeholder {
          color: rgba(39, 28, 17, 0.35);
        }
        .typing-cursor {
          width: 2px;
          height: 20px;
          background: #01FA92;
          border-radius: 1px;
          animation: typingBlink 1s step-end infinite;
          pointer-events: none;
        }
        @keyframes typingBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
