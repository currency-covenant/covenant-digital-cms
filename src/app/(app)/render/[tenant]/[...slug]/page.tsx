import type { Where } from 'payload'

import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import { RenderPage, generatePageMetadata } from '../../../../components/RenderPage'

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

  return <RenderPage data={pageData} />
}
