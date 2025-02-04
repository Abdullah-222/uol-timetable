import type { Metadata } from 'next'
import './globals.css'
import Footer from '../components/footer'

export const metadata: Metadata = {
  title: 'UOL Timetable',
  description: 'UOL Timetable Generator',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main> {/* Main content */}
        <Footer /> {/* Footer stays at the bottom */}
      </body>
    </html>
  )
}
