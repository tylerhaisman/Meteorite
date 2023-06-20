import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '@/components/providers/providers'
import SignIn from '@/components/signin/SignIn'

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
      <body className={inter.className}>
        <Providers>
          {children}
          </Providers>
      </body>
    </html>
  )
}
