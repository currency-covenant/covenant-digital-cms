import type { Page } from '@payload-types'

import React from 'react'

type Meta = NonNullable<Page['meta']>

interface PageMetadataProps {
  page: Page
  siteUrl?: string
  siteName?: string
}

function getMediaUrl(media: unknown): string | undefined {
  if (media && typeof media === 'object' && 'url' in media) {
    return (media as { url: string }).url
  }
  return undefined
}

export function PageMetadata({ page, siteUrl = '', siteName = 'Lbdluxe' }: PageMetadataProps) {
  const title = page.meta?.title || page.title
  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const description = page.meta?.description || undefined
  const ogImage = page.meta?.image ? getMediaUrl(page.meta.image) : undefined

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}
      <meta property="og:site_name" content={siteName} />
      {page.slug && <meta property="og:url" content={`${siteUrl}/${page.slug}`} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  )
}

export function generatePageMetadata(page: Page): Record<string, unknown> {
  const title = page.meta?.title || page.title
  const fullTitle = title ? `${title} | Lbdluxe` : 'Lbdluxe'
  const description = page.meta?.description || undefined
  const ogImage = page.meta?.image ? getMediaUrl(page.meta.image) : undefined

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}
