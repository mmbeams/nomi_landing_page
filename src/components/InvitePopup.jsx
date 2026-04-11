import { useState } from 'react'

// =============================================
//  Google Form config — replace with your own
// =============================================
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const GOOGLE_FORM_EMAIL_FIELD = 'entry.XXXXXXX'

export default function InvitePopup({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || submitting) return

    setSubmitting(true)
    try {
      const formData = new URLSearchParams()
      formData.append(GOOGLE_FORM_EMAIL_FIELD, email)

      await fetch(GOOGLE_FORM_ACTION, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      setSubmitted(true)
      window.dispatchEvent(new Event('waitlist-signup'))
      setTimeout(() => {
        onClose()
        setEmail('')
        setSubmitted(false)
      }, 2000)
    } catch {
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      onClick={() => { if (!submitting) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-color, #FEFCF9)',
          borderRadius: '16px',
          padding: '36px 32px',
          width: '100%',
          maxWidth: '400px',
          margin: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '28px',
              color: 'var(--text-main)',
              marginBottom: '8px',
            }}>
              You're on the list
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              color: 'var(--text-dim, #888)',
            }}>
              We'll send your invite code soon.
            </p>
          </div>
        ) : (
          <>
            <div>
              <p style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '28px',
                color: 'var(--text-main)',
                marginBottom: '4px',
              }}>
                Get your invite code
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'var(--text-dim, #888)',
              }}>
                Enter your Gmail to join the waitlist.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  outline: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'var(--text-main)',
                  color: '#FEFCF9',
                  padding: '10px 20px',
                  borderRadius: '32px',
                  fontWeight: 500,
                  fontSize: '13px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {submitting ? 'Submitting...' : 'Join waitlist'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
