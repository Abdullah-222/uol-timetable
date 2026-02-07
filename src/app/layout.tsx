import type { Metadata } from 'next'
import './globals.css'
import Footer from '../components/footer'
import Navbar from '../components/navbar'

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
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-dark-bg text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
