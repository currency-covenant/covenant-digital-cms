import type { Page } from '@payload-types'

import React from 'react'

import { ProfileBlock } from '@/blocks/Profile/Component'
import { MarqueeBlock } from '@/blocks/Marquee/Component'

const blockComponents: Record<string, React.ComponentType<any>> = {
  profile: ProfileBlock,
  marquee: MarqueeBlock,
}

type Block = NonNullable<NonNullable<Page['layout']>[number]>

export const RenderBlocks = ({ blocks }: { blocks: Block[] }) => {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, i) => {
        const BlockComponent = blockComponents[block.blockType]

        if (!BlockComponent) {
          return null
        }

        const { blockType, blockName, ...blockFields } = block

        return <BlockComponent key={`${blockType}-${i}`} {...blockFields} />
      })}
    </>
  )
}
