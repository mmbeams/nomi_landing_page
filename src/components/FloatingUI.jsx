import { useState } from 'react'

function ActionItem({ label, shortcut }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: hovered ? '1px solid var(--border)' : '1px solid transparent',
        color: hovered ? 'var(--accent)' : 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label}
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: 'var(--text-dim)',
          background: '#EBE5DC',
          padding: '2px 6px',
          borderRadius: '4px',
        }}
      >
        {shortcut}
      </span>
    </div>
  )
}

export default function FloatingUI() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '120px' }}>
      <div
        style={{
          width: '820px',
          background: 'var(--ui-white)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Input Area */}
        <div
          style={{
            padding: '48px 48px 40px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Analyze tax liability..."
              autoFocus
              style={{
                fontSize: '32px',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                border: 'none',
                outline: 'none',
                width: '100%',
                padding: 0,
                color: 'var(--text-main)',
                background: 'transparent',
                fontFamily: 'Inter, sans-serif',
              }}
            />
            <div className="cursor-blink" />
          </div>
        </div>

        {/* Content Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 280px',
            minHeight: '400px',
          }}
        >
          {/* Log Preview */}
          <div
            style={{
              padding: '40px 48px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              lineHeight: 1.8,
              color: '#5E5852',
              background: '#F4F1EC',
              borderRight: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                textTransform: 'uppercase',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: 'var(--text-dim)',
                marginBottom: '24px',
                display: 'block',
              }}
            >
              System Context / Log Preview
            </span>
            {[
              { time: '09:42:15', msg: '| Initializing Deduction Mapping...' },
              { time: '09:42:16', msg: '| Mapping 14M+ data points.' },
              { time: '09:42:17', msg: '| Asset reconciliation active.' },
            ].map(({ time, msg }) => (
              <span key={time} style={{ display: 'block', marginBottom: '4px' }}>
                <span style={{ color: 'var(--accent)', fontWeight: 400 }}>{time}</span> {msg}
              </span>
            ))}
            <span style={{ display: 'block', marginBottom: '4px' }}>
              -----------------------------------
            </span>
            <span style={{ display: 'block', marginBottom: '4px' }}>ID: #THERA_8925_ALPHA</span>
            <span style={{ display: 'block', marginBottom: '4px' }}>SRC: STREAMS_INSTANT</span>
            <span style={{ display: 'block', marginBottom: '4px' }}>STA: READY_FOR_ANALYSIS</span>
            <span style={{ display: 'block', marginBottom: '4px' }}>
              -----------------------------------
            </span>
            <span style={{ display: 'block', marginBottom: '4px', opacity: 0.4 }}>
              Waiting for user prompt sequence...
            </span>
          </div>

          {/* Sidebar Actions */}
          <div
            style={{
              padding: '40px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              background: 'var(--ui-white)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Workflow
              </div>
              <ActionItem label="Start Analysis" shortcut="↵" />
              <ActionItem label="Import Streams" shortcut="⌘I" />
              <ActionItem label="Audit Shield" shortcut="⌘S" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Session
              </div>
              <ActionItem label="Archive Log" shortcut="⌃A" />
              <ActionItem label="Logout" shortcut="⎋" />
            </div>
          </div>
        </div>

        {/* Footer Status */}
        <div
          style={{
            padding: '16px 48px',
            background: 'var(--ui-white)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            <span
              style={{
                width: '6px',
                height: '6px',
                background: 'var(--accent)',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: '8px',
                opacity: 0.8,
              }}
            />
            Theradime Core v2.4.1 Active
          </div>
          <div>15 APRIL 2024 • SF / LDN / BER</div>
        </div>
      </div>
    </div>
  )
}
