const features = [
  {
    title: 'Capture everything',
    description: 'Notes, photos, links, voice memos — grab anything in a single tap. Your ideas never slip away again.',
    image: 'product/1.png',
  },
  {
    title: 'Smart Organize',
    description: 'AI understands your content and sorts it automatically. Tags, folders, connections — all handled for you.',
    image: 'product/2.png',
  },
]

function FeatureRow({ feature, reversed }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: reversed ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: '48px',
      }}
    >
      {/* Text side */}
      <div
        style={{
          flex: '0 0 35%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: '38px',
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
            lineHeight: 1.65,
            color: 'var(--text-dim)',
            fontWeight: 400,
            margin: 0,
          }}
        >
          {feature.description}
        </p>
      </div>

      {/* Image side */}
      <div style={{ flex: '0 0 60%' }}>
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
  return (
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '64px',
      }}
    >
      {features.map((feature, i) => (
        <FeatureRow
          key={feature.title}
          feature={feature}
          reversed={i % 2 !== 0}
        />
      ))}
    </section>
  )
}
