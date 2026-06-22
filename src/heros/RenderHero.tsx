import type { Page } from '@payload-types'

import Image from 'next/image'
import React from 'react'

type Hero = NonNullable<Page['hero']>

export const RenderHero = ({ hero }: { hero?: Hero }) => {
  if (!hero || hero.type === 'none') {
    return null
  }

  const mediaUrl =
    hero.media && typeof hero.media === 'object' && 'url' in hero.media
      ? hero.media.url
      : null

  return (
    <section className="w-full">
      {hero.type === 'highImpact' && (
        <div
          className="relative flex items-center justify-center min-h-[80vh] bg-cover bg-center"
          style={
            mediaUrl
              ? { backgroundImage: `url(${mediaUrl})` }
              : { backgroundColor: 'var(--muted)' }
          }
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto">
              {hero.richText ? 'Hero Section' : ''}
            </h1>
          </div>
        </div>
      )}

      {hero.type === 'mediumImpact' && (
        <div className="grid md:grid-cols-2 gap-8 items-center px-4 py-16 max-w-6xl mx-auto">
          <div className="text-lg leading-relaxed">
            {hero.richText ? 'Hero Section' : ''}
          </div>
          {mediaUrl && (
            <Image
              src={mediaUrl}
              alt=""
              width={1200}
              height={675}
              className="w-full rounded-xl shadow-lg"
            />
          )}
        </div>
      )}

      {hero.type === 'lowImpact' && (
        <div className="px-4 py-12 max-w-4xl mx-auto text-center">
          <div className="text-xl leading-relaxed">
            {hero.richText ? 'Hero Section' : ''}
          </div>
        </div>
      )}
    </section>
  )
}
