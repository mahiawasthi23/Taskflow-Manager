import './globals.css'
import Navbar from '@/app/component/Navbar'


export const metadata = { title: 'Taskflow Manager' }


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="p-4 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  )
}
