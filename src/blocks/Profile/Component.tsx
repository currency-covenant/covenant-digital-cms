'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import type { ProfileBlock as ProfileBlockType } from '@payload-types'

/* ----------------------------------------
   Typewriter Hook
---------------------------------------- */

function useTypewriter(
  words: Array<string>,
  speed = 90,
  deleteSpeed = 40,
  pause = 1200,
) {
  const [index, setIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setBlink((v) => !v), 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (words.length === 0) return

    const current = words[index]

    if (!deleting && subIndex === current?.length) {
      setTimeout(() => setDeleting(true), pause)
      return
    }

    if (deleting && subIndex === 0) {
      setDeleting(false)
      setIndex((prev) => (prev + 1) % words.length)
      return
    }

    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deleteSpeed : speed,
    )

    return () => clearTimeout(timeout)
  }, [subIndex, deleting, index, words, pause, speed, deleteSpeed])

  return words.length > 0
    ? `${words[index]?.substring(0, subIndex) ?? ''}${blink ? '|' : ''}`
    : ''
}

/* ----------------------------------------
   Profile Component
---------------------------------------- */

type ProfileBlockProps = Omit<ProfileBlockType, 'id' | 'blockName' | 'blockType'>

export const ProfileBlock = (props: ProfileBlockProps) => {
  const { name, words, description, profileImage } = props

  const wordList = (words ?? []).map((w: { word: string }) => w.word).filter(Boolean)
  const typewriter = useTypewriter(wordList)

  const imageUrl =
    profileImage && typeof profileImage === 'object' && 'url' in profileImage
      ? profileImage.url
      : null

  if (!name) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <Skeleton className="w-80 h-80 rounded-2xl" />
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center text-center">
        <Card
          className="
            w-80 h-80 flex flex-col items-center justify-center gap-4
            border border-neutral-500/40 rounded-2xl
            backdrop-blur-lg bg-[var(--background)]/5
            shadow-xl p-0
          "
        >
          {imageUrl ? (
            <Image
              alt="Profile photo"
              src={imageUrl}
              width={304}
              height={304}
              className="w-76 h-76 object-cover rounded-xl filter grayscale"
            />
          ) : (
            <div className="text-[var(--muted-foreground)] text-sm">
              No profile image
            </div>
          )}
        </Card>
      </div>

      <div
        className="
          mt-6 px-6 py-6 rounded-2xl backdrop-blur-sm
          bg-[var(--background)]/10
          border border-[var(--border)]/50
          shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]
          flex flex-col items-center gap-3 text-center
        "
      >
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] drop-shadow-sm">
          {name}
        </h1>

        {wordList.length > 0 && (
          <p className="text-2xl font-medium text-[#8F4BD2] h-7 tracking-wide select-none">
            {typewriter}
          </p>
        )}

        {description && (
          <p className="text-xl mt-2 leading-relaxed text-[var(--foreground)]/70 max-w-sm">
            {description}
          </p>
        )}
      </div>
    </>
  )
}
