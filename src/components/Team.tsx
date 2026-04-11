"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * ========================================
 *  TEAM MEMBER PHOTOS — REPLACE THESE!
 * ========================================
 *  Upload your 3 team photos and swap the
 *  URLs below. Each `photo` field is where
 *  your image goes.
 * ========================================
 */
const teamMembers = [
  {
    id: 1,
    name: "Victor Zhang",
    role: "Product",
    bio: "Passionate about reimagining how students learn together.",
    photo: `${import.meta.env.BASE_URL}team1.jpg`,
  },
  {
    id: 2,
    name: "Wayne Wang",
    role: "Back-End Engineer",
    bio: "Building the technology that makes learning feel effortless.",
    photo: `${import.meta.env.BASE_URL}team2.jpg`,
  },
  {
    id: 3,
    name: "Moira Huang",
    role: "Design Engineer",
    bio: "I lost my lipstick again.",
    photo: `${import.meta.env.BASE_URL}team3.jpg`,
  },
]

export function Team() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedBio, setDisplayedBio] = useState(teamMembers[0].bio)
  const [displayedRole, setDisplayedRole] = useState(teamMembers[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setDisplayedBio(teamMembers[index].bio)
      setDisplayedRole(teamMembers[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: "0",
        gap: "12px",
      }}
    >
      <div className="flex flex-col items-center gap-10">
        {/* Bio Container */}
        <div className="relative px-8">
          <p
            className={cn(
              "text-2xl md:text-3xl font-light text-center max-w-lg leading-relaxed transition-all duration-400 ease-out",
              isAnimating
                ? "opacity-0 blur-sm scale-[0.98]"
                : "opacity-100 blur-0 scale-100"
            )}
            style={{ color: "var(--text-main)" }}
          >
            {displayedBio}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 mt-2">
          {/* Role text */}
          <p
            className={cn(
              "text-xs tracking-[0.2em] uppercase transition-all duration-500 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            )}
            style={{ color: "var(--text-dim)" }}
          >
            {displayedRole}
          </p>

          <div className="flex items-center justify-center gap-2">
            {teamMembers.map((member, index) => {
              const isActive = activeIndex === index
              const isHovered = hoveredIndex === index && !isActive
              const showName = isActive || isHovered

              return (
                <button
                  key={member.id}
                  onClick={() => handleSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "relative flex items-center gap-0 rounded-full",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "pr-4 pl-2 py-2" : "p-0.5"
                  )}
                  style={{
                    background: isActive
                      ? "var(--text-main)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 10px 30px rgba(45,42,38,0.15)"
                      : "none",
                    cursor: "none",
                  }}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className={cn(
                        "w-8 h-8 rounded-full object-cover",
                        "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                        isActive
                          ? "ring-2 ring-[var(--bg-color)]/30"
                          : "ring-0",
                        !isActive && "hover:scale-105"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                      showName
                        ? "grid-cols-[1fr] opacity-100 ml-2"
                        : "grid-cols-[0fr] opacity-0 ml-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <span
                        className="text-sm font-medium whitespace-nowrap block transition-colors duration-300"
                        style={{
                          color: isActive
                            ? "var(--bg-color)"
                            : "var(--text-main)",
                        }}
                      >
                        {member.name}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
