import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PopupWidget from './components/PopupWidget'
import Features from './components/Features'
import CTAButtons from './components/CTAButtons'
import CursorEffect from './components/CursorEffect'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <CursorEffect />
      <Navbar />
      <Hero />
      <div style={{ margin: '32px 0 64px' }}>
        <PopupWidget />
      </div>

      {/* Product overview screenshot */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={`${import.meta.env.BASE_URL}product/overview.png`}
          alt="Product overview"
          style={{
            width: '100%',
            maxWidth: '1100px',
            borderRadius: '0',
            display: 'block',
          }}
        />
      </div>

      <div style={{ marginTop: '64px' }}>
        <Features />
      </div>

      <CTAButtons />
      <div style={{ paddingBottom: '80px' }} />
    </div>
  )
}
