import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-gray-800 text-white p-4 fixed w-full z-10">
          <div className="container mx-auto flex items-center">
          <img src="aipiSolutions.png" alt="Company Logo" className="h-8 w-auto mr-5" />
            <h1 className="font-bold text-xl">NDA Editor - AIPI Solutions</h1>
          </div>
        </header>

        <main>
        
          {children}
         
        </main>

        <footer className="bg-gray-800 text-white p-4 z-10">
          <div className="container mx-auto">
            <p>&copy; {new Date().getFullYear()} AIPI Solutions. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}