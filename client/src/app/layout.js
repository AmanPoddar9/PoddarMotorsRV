import { Inter } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhoneButton from './components/PhoneButton'
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Poddar Motors',
  description: 'Real Value by Poddar Motors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta name="google-site-verification" content="uL--6MiSuQXVZ6-5v0W39EvGPd7r4cPjvjMWa-EBrKE" />
      <Script id="meta-pixel-code" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '397160436657081');
          fbq('track', 'PageView');
        ` }} />
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=397160436657081&ev=PageView&noscript=1"
          />
        </noscript>

      </head>
      <body style={{width:'100vw', overflowX:'hidden', paddingTop:'4rem'}}>
        <Navbar />
        <AntdRegistry>{children}</AntdRegistry>
        <PhoneButton />
        <Footer />
      </body>
    </html>
  )
}
