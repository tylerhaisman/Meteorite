import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/providers/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Meteorite Messaging',
  description: 'Messaging from another planet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#4f67c8"/>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          </Providers>
      </body>
    </html>
  )
}
