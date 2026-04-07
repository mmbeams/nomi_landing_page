import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PopupWidget from './components/PopupWidget'
import Features from './components/Features'
import Waitlist from './components/Waitlist'
import Footer from './components/Footer'
import CursorEffect from './components/CursorEffect'
import { DitheringShader } from './components/ui/dithering-shader'
import { StaggerTestimonials } from './components/ui/stagger-testimonials'
import { useIsMobile } from './hooks/useMobile'

export default function App() {
  const overviewRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = overviewRef.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.filter = 'blur(8px)'
    el.style.transition = 'opacity 1s ease, transform 1s ease, filter 1s ease'
    setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      el.style.filter = 'blur(0px)'
    }, 1100)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
      <CursorEffect />
      <Navbar />

      {/* Shader background wrapping hero through overview */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: isMobile ? '24px' : '48px' }}>
        <DitheringShader
          shape="wave"
          type="8x8"
          colorBack="#F3F2F1"
          colorFront="#01FA92"
          pxSize={3}
          speed={0.6}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '110%', width: '100%' }}
          width={1920}
          height={1200}
        />

        {/* Content on top */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <div style={{ margin: isMobile ? '28px 0 48px' : '40px 0 80px' }}>
            <PopupWidget />
          </div>

          {/* Product overview screenshot */}
          <div ref={overviewRef} style={{ display: 'flex', justifyContent: 'center', paddingTop: isMobile ? '40px' : '80px', padding: isMobile ? '40px 16px 0' : '80px 0 0', opacity: 0 }}>
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
        </div>
      </div>

      <div style={{ marginTop: isMobile ? '32px' : '64px' }}>
        <Features />
      </div>

      <div style={{ marginTop: isMobile ? '24px' : '64px' }}>
        <StaggerTestimonials />
      </div>

      {/* Pixel shader background wrapping waitlist + footer */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <DitheringShader
          shape="wave"
          type="8x8"
          colorBack="#F3F2F1"
          colorFront="#01FA92"
          pxSize={3}
          speed={0.6}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '110%', width: '100%' }}
          width={1920}
          height={1200}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Waitlist />
          <Footer />
          <div style={{ paddingBottom: '40px' }} />
        </div>
      </div>
    </div>
  )
}
