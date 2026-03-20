export default function CTAButtons() {
  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', padding: '0 24px' }}>
      <button
        style={{
          background: 'var(--text-main)',
          color: '#FEFCF9',
          padding: '12px 24px',
          borderRadius: '32px',
          fontWeight: 500,
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        Join Waitlist
      </button>
      <button
        style={{
          border: '1px solid #EBE8E5',
          color: 'var(--text-main)',
          background: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '32px',
          fontWeight: 500,
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F9F7F4')}
        onMouseLeave={e => (e.currentTarget.style.background = '#FFFFFF')}
      >
        How it works
      </button>
    </div>
  )
}
