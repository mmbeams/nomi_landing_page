"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  { tempId: 0, testimonial: "My favorite solution in the market. We work 5x faster with Nomi.", by: "Alex, CEO at TechCorp", imgSrc: "https://i.pravatar.cc/150?img=1" },
  { tempId: 1, testimonial: "I'm confident my data is safe with Nomi. I can't say that about other providers.", by: "Dan, CTO at SecureNet", imgSrc: "https://i.pravatar.cc/150?img=2" },
  { tempId: 2, testimonial: "I know it's cliche, but we were lost before we found Nomi. Can't thank you guys enough!", by: "Stephanie, COO at InnovateCo", imgSrc: "https://i.pravatar.cc/150?img=3" },
  { tempId: 3, testimonial: "Nomi's products make planning for the future seamless. Can't recommend them enough!", by: "Marie, CFO at FuturePlanning", imgSrc: "https://i.pravatar.cc/150?img=4" },
  { tempId: 4, testimonial: "If I could give 11 stars, I'd give 12.", by: "Andre, Head of Design at CreativeSolutions", imgSrc: "https://i.pravatar.cc/150?img=5" },
  { tempId: 5, testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.", by: "Jeremy, Product Manager at TimeWise", imgSrc: "https://i.pravatar.cc/150?img=6" },
  { tempId: 6, testimonial: "Took some convincing, but now that we're on Nomi, we're never going back.", by: "Pam, Marketing Director at BrandBuilders", imgSrc: "https://i.pravatar.cc/150?img=7" },
  { tempId: 7, testimonial: "I would be lost without Nomi's in-depth analytics. The ROI is EASILY 100X for us.", by: "Daniel, Data Scientist at AnalyticsPro", imgSrc: "https://i.pravatar.cc/150?img=8" },
  { tempId: 8, testimonial: "It's just the best. Period.", by: "Fernando, UX Designer at UserFirst", imgSrc: "https://i.pravatar.cc/150?img=9" },
  { tempId: 9, testimonial: "I switched 5 years ago and never looked back.", by: "Andy, DevOps Engineer at CloudMasters", imgSrc: "https://i.pravatar.cc/150?img=10" },
  { tempId: 10, testimonial: "I've been searching for a solution like Nomi for YEARS. So glad I finally found one!", by: "Pete, Sales Director at RevenueRockets", imgSrc: "https://i.pravatar.cc/150?img=11" },
  { tempId: 11, testimonial: "It's so simple and intuitive, we got the team up to speed in 10 minutes.", by: "Marina, HR Manager at TalentForge", imgSrc: "https://i.pravatar.cc/150?img=12" },
  { tempId: 12, testimonial: "Nomi's customer support is unparalleled. They're always there when we need them.", by: "Olivia, Customer Success Manager at ClientCare", imgSrc: "https://i.pravatar.cc/150?img=13" },
  { tempId: 13, testimonial: "The efficiency gains we've seen since implementing Nomi are off the charts!", by: "Raj, Operations Manager at StreamlineSolutions", imgSrc: "https://i.pravatar.cc/150?img=14" },
  { tempId: 14, testimonial: "Nomi has revolutionized how we handle our workflow. It's a game-changer!", by: "Lila, Workflow Specialist at ProcessPro", imgSrc: "https://i.pravatar.cc/150?img=15" },
  { tempId: 15, testimonial: "The scalability of Nomi's solution is impressive. It grows with our business seamlessly.", by: "Trevor, Scaling Officer at GrowthGurus", imgSrc: "https://i.pravatar.cc/150?img=16" },
  { tempId: 16, testimonial: "I appreciate how Nomi continually innovates. They're always one step ahead.", by: "Naomi, Innovation Lead at FutureTech", imgSrc: "https://i.pravatar.cc/150?img=17" },
  { tempId: 17, testimonial: "The ROI we've seen with Nomi is incredible. It's paid for itself many times over.", by: "Victor, Finance Analyst at ProfitPeak", imgSrc: "https://i.pravatar.cc/150?img=18" },
  { tempId: 18, testimonial: "Nomi's platform is so robust, yet easy to use. It's the perfect balance.", by: "Yuki, Tech Lead at BalancedTech", imgSrc: "https://i.pravatar.cc/150?img=19" },
  { tempId: 19, testimonial: "We've tried many solutions, but Nomi stands out in terms of reliability and performance.", by: "Zoe, Performance Manager at ReliableSystems", imgSrc: "https://i.pravatar.cc/150?img=20" },
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: cardSize,
        height: cardSize,
        borderRadius: '0',
        padding: '32px',
        cursor: 'pointer',
        transition: 'all 0.5s ease-in-out',
        background: isCenter ? '#01FA92' : 'rgba(255, 255, 255, 0.6)',
        border: isCenter ? 'none' : '1px solid rgba(235, 232, 229, 0.5)',
        backdropFilter: isCenter ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: isCenter ? 'none' : 'blur(12px)',
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? '0 20px 50px rgba(45, 42, 38, 0.15)' : 'none',
        zIndex: isCenter ? 10 : 0,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
      }}
    >
      <div>
        <img
          src={testimonial.imgSrc}
          alt={`${testimonial.by.split(',')[0]}`}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'top',
            marginBottom: '16px',
          }}
        />
        <p style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: '20px',
          lineHeight: 1.4,
          letterSpacing: '-0.01em',
          color: isCenter ? '#2D2A26' : '#2D2A26',
        }}>
          "{testimonial.testimonial}"
        </p>
      </div>
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        color: isCenter ? 'rgba(45,42,38,0.8)' : 'var(--text-main)',
        letterSpacing: '0.04em',
      }}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      style={{ position: 'relative', width: '100%', overflow: 'hidden', height: cardSize === 290 ? 480 : 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={() => handleMove(-1)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--text-main)',
            color: '#FEFCF9',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={16} strokeWidth={1.2} />
        </button>
        <button
          onClick={() => handleMove(1)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--text-main)',
            color: '#FEFCF9',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          aria-label="Next testimonial"
        >
          <ChevronRight size={16} strokeWidth={1.2} />
        </button>
      </div>
    </div>
  );
};
