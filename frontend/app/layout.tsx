import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ChatWidget } from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog Application',
  description: 'A modern blog application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 -z-10" />
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(180 83 9) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
              
              <Navbar />
              <main className="flex-1 relative z-10 pt-16">
                {children}
              </main>
              <Footer />
              
              <ChatWidget />
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}


