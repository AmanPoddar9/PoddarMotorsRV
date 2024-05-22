import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhoneButton from './components/PhoneButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Poddar Motors',
  description: 'Real Value by Poddar Motors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{width:'100vw', overflowX:'hidden', paddingTop:'4rem'}}>
        <Navbar />
        <AntdRegistry>{children}</AntdRegistry>
        <PhoneButton />
        <Footer />
      </body>
    </html>
  )
}
