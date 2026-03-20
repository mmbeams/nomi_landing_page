export default function Hero() {
  return (
    <header
      style={{
        textAlign: 'center',
        padding: '56px 24px 0',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: '84px',
          lineHeight: 1,
          marginBottom: '20px',
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
        }}
      >
        Capture anything, at anytime.
      </h1>

      {/* Feature pills row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          marginBottom: '20px',
        }}
      >
        {['Notes', 'Photos', 'Links'].map((item, i) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && (
              <span style={{
                width: '1px',
                height: '16px',
                background: '#D1CFC9',
                margin: '0 20px',
                display: 'inline-block',
              }} />
            )}
            <span style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-main)',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--text-main)',
          maxWidth: '580px',
          margin: '0 auto',
          fontWeight: 500,
          lineHeight: 1.6,
          fontFamily: 'Inter, sans-serif',
          opacity: 0.4,
        }}
      >
        Jot down notes, photos, links, and inspo...<br />just a popup that appears while you work.
      </p>
    </header>
  )
}
