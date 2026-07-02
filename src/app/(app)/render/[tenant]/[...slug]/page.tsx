import type { Where } from 'payload'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'
import { renderToString } from 'react-dom/server'

import { RenderPage, generatePageMetadata } from '../../../../components/RenderPage'

const SITE_NAME = 'Covenant Digital'
const SITE_URL = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://covenant.digital'

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {
  const params = await paramsPromise
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const slug = params?.slug

  const slugConstraint: Where = slug
    ? {
        slug: {
          equals: slug.join('/'),
        },
      }
    : {
        or: [
          { slug: { equals: '' } },
          { slug: { equals: 'home' } },
          { slug: { exists: false } },
        ],
      }

  const pageQuery = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    user,
    where: {
      and: [{ 'tenant.slug': { equals: params.tenant } }, slugConstraint],
    },
  })

  const pageData = pageQuery.docs?.[0]
  if (!pageData) {
    return {}
  }

  return generatePageMetadata(pageData)
}

export default async function Page({
  params: paramsPromise,
}: {
  params: Promise<{ slug?: string[]; tenant: string }>
}) {
  const params = await paramsPromise
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const slug = params?.slug

  const slugConstraint: Where = slug
    ? {
        slug: {
          equals: slug.join('/'),
        },
      }
    : {
        or: [
          { slug: { equals: '' } },
          { slug: { equals: 'home' } },
          { slug: { exists: false } },
        ],
      }

  const pageQuery = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    user,
    where: {
      and: [{ 'tenant.slug': { equals: params.tenant } }, slugConstraint],
    },
  })

  const pageData = pageQuery.docs?.[0]

  if (!pageData) {
    return notFound()
  }

  const pageTitle = pageData.meta?.title || pageData.title
  const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : SITE_NAME
  const description = pageData.meta?.description || ''

  let ogImage: string | undefined
  if (pageData.meta?.image && typeof pageData.meta.image === 'object' && 'url' in pageData.meta.image) {
    ogImage = pageData.meta.image.url as string
  }

  const htmlContent = renderToString(<RenderPage data={pageData} />)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(fullTitle)}</title>
  ${description ? `<meta name="description" content="${escapeHtml(description)}" />` : ''}

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(fullTitle)}" />
  ${description ? `<meta property="og:description" content="${escapeHtml(description)}" />` : ''}
  ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />` : ''}
  <meta property="og:site_name" content="${SITE_NAME}" />
  ${pageData.slug ? `<meta property="og:url" content="${SITE_URL}/${pageData.slug}" />` : ''}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
  ${description ? `<meta name="twitter:description" content="${escapeHtml(description)}" />` : ''}
  ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />` : ''}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 0 0% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 0 0% 3.9%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
      --secondary: 0 0% 96.1%;
      --secondary-foreground: 0 0% 9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --accent: 0 0% 96.1%;
      --accent-foreground: 0 0% 9%;
      --border: 0 0% 89.8%;
      --input: 0 0% 89.8%;
      --ring: 0 0% 3.9%;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: hsl(var(--background)); color: hsl(var(--foreground)); }
  </style>
</head>
<body>
  <div id="root">${htmlContent}</div>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script>
    // Simple hydration - mounts React on the rendered content
    const root = document.getElementById('root');
    if (root && window.React && window.ReactDOM) {
      window.ReactDOM.hydrateRoot(root, window.React.createElement('div', { dangerouslySetInnerHTML: { __html: root.innerHTML } }));
    }
  </script>
</body>
</html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
