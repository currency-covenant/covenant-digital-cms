import React from 'react'

import '../globals.css'

export const metadata = {
  description: 'Lbdluxe content management system',
  title: 'Lbdluxe',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
}

// eslint-disable-next-line no-restricted-exports
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}