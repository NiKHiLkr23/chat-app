import Providers from '@/components/Providers'
import './globals.css'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Direct Message',
  description: 'Welcome to DM',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body >
        <Providers>

        {children}
        </Providers>
        </body>
    </html>
  )
}
