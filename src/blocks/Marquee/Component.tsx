'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { MarqueeBlock as MarqueeBlockType } from '@payload-types'
import * as SiIcons from 'react-icons/si'

const iconMap: Record<string, React.ComponentType<{ size?: number; title?: string }>> =
  SiIcons as unknown as Record<string, React.ComponentType<{ size?: number; title?: string }>>

function resolveIcon(slug: string | null | undefined) {
  if (!slug) return null
  // react-icons/si exports components like SiReact, SiNextdotjs, etc.
  const key = `Si${slug.charAt(0).toUpperCase() + slug.slice(1)}`
  return iconMap[key] ?? null
}

/* ------------------------------------------------------------------ */
/*  Uploaded icon helpers                                             */
/* ------------------------------------------------------------------ */

function getUploadIconUrl(uploadIcon: unknown): string | null {
  if (!uploadIcon || typeof uploadIcon !== 'object') return null
  const obj = uploadIcon as Record<string, unknown>
  if (typeof obj.url === 'string' && obj.url) return obj.url
  return null
}

function getUploadIconAlt(uploadIcon: unknown): string | undefined {
  if (!uploadIcon || typeof uploadIcon !== 'object') return undefined
  const obj = uploadIcon as Record<string, unknown>
  if (typeof obj.alt === 'string') return obj.alt
  return undefined
}

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type MarqueeItem = NonNullable<NonNullable<MarqueeBlockType['items']>[number]>

type MarqueeBlockProps = Omit<MarqueeBlockType, 'id' | 'blockName' | 'blockType'>

/* ------------------------------------------------------------------ */
/*  Marquee Component                                                 */
/* ------------------------------------------------------------------ */

export const MarqueeBlock = (props: MarqueeBlockProps) => {
  const { items } = props

  if (!items || items.length === 0) return null

  return (
    <section className="relative w-full overflow-hidden py-12">
      {/* Gradient overlays for the fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />

      {/* Scrolling track – first pass */}
      <div className="marquee-track flex gap-8 animate-marquee">
        {items.map((item: MarqueeItem, i: number) => (
          <MarqueeItemCard key={`a-${i}`} item={item} />
        ))}
      </div>

      {/* Scrolling track – second pass (duplicated for seamless loop) */}
      <div className="marquee-track flex gap-8 animate-marquee" aria-hidden>
        {items.map((item: MarqueeItem, i: number) => (
          <MarqueeItemCard key={`b-${i}`} item={item} />
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee-scroll 30s linear infinite;
        }
      `}</style>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Individual marquee item card                                       */
/* ------------------------------------------------------------------ */

const MarqueeItemCard = ({ item }: { item: MarqueeItem }) => {
  const { title, icon, uploadIcon } = item

  // Uploaded icon takes precedence over simple-icons slug
  const uploadUrl = getUploadIconUrl(uploadIcon)
  const uploadAlt = getUploadIconAlt(uploadIcon)
  const IconComponent = !uploadUrl && icon ? resolveIcon(icon) : null

  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-3 rounded-xl border border-neutral-500/30',
        'bg-[var(--background)]/10 backdrop-blur-md px-6 py-4 shadow-sm',
        'whitespace-nowrap select-none',
      )}
    >
      {uploadUrl ? (
        <Image
          src={uploadUrl}
          alt={uploadAlt ?? title}
          width={22}
          height={22}
          className="size-[22px] object-contain"
        />
      ) : IconComponent ? (
        <span className="text-[var(--foreground)]/80">
          <IconComponent size={22} />
        </span>
      ) : null}
      <span className="text-lg font-medium text-[var(--foreground)]">{title}</span>
    </div>
  )
}
