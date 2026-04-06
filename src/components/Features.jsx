import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: 'Capture everything',
    description:
      'Notes, photos, links, voice memos — grab anything in a single tap. Your ideas never slip away again.',
    image: 'product/1.png',
  },
  {
    title: 'Smart Detect',
    description:
      'AI recognizes what you capture — receipts, screenshots, documents — and extracts key details instantly.',
    image: 'product/2.png',
  },
  {
    title: 'Smart Organize',
    description:
      'AI understands your content and sorts it automatically. Tags, folders, connections — all handled for you.',
    image: 'product/3.png',
  },
]

function FeatureCard({ feature, index }) {
  return (
    <div
      className="feature-card"
      style={{
        minWidth: '90vw',
        maxWidth: '1200px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '48px',
        paddingRight: '60px',
        flexShrink: 0,
      }}
    >
      {/* Text side */}
      <div
        style={{
          flex: '0 0 25%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            fontWeight: 400,
            color: 'var(--accent)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          0{index + 1}
        </span>
        <h3
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '42px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            margin: 0,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: 1.4,
            color: 'var(--text-main)',
            fontWeight: 400,
            margin: 0,
            maxWidth: '320px',
          }}
        >
          {feature.description}
        </p>
      </div>

      {/* Image side */}
      <div style={{ flex: 1 }}>
        <img
          src={`${import.meta.env.BASE_URL}${feature.image}`}
          alt={feature.title}
          style={{
            width: '100%',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export default function Features() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const getScrollAmount = () => {
      return -(track.scrollWidth - window.innerWidth)
    }

    const tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100vh',
          width: 'max-content',
          paddingLeft: '8vw',
          gap: '0px',
        }}
      >
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  )
}
