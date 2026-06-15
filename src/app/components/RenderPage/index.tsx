import type { Page } from '@payload-types'

import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'

export const RenderPage = ({ data }: { data: Page }) => {
  return (
    <>
      <form action="/api/users/logout" method="post">
        <button type="submit">Logout</button>
      </form>

      <RenderHero hero={data.hero} />
      <RenderBlocks blocks={data.layout} />
    </>
  )
}
