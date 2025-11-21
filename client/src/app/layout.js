import { Inter, Outfit } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhoneButton from './components/PhoneButton'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = {
  metadataBase: new URL('https://poddarmotors.com'),
  title: {
    default: 'Poddar Motors Real Value',
    template: '%s | Poddar Motors Real Value',
  },
  description:
    'Second hand car dealership in Ranchi Jharkhand, Used car finance, used cars for sale',
  openGraph: {
    title: 'Poddar Motors Real Value',
    description:
      'Second hand car dealership in Ranchi Jharkhand, Used car finance, used cars for sale',
    url: 'https://poddarmotors.com',
    siteName: 'Poddar Motors Real Value',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Poddar Motors Real Value',
    description:
      'Second hand car dealership in Ranchi Jharkhand, Used car finance, used cars for sale',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="google-site-verification"
          content="uL--6MiSuQXVZ6-5v0W39EvGPd7r4cPjvjMWa-EBrKE"
        />

        {/* Facebook meta code */}
        <Script
          id="meta-pixel-code"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
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
        `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=397160436657081&ev=PageView&noscript=1"
          />
        </noscript>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W72KKBE49S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W72KKBE49S');
          `}
        </Script>
      </head>
      <body className="w-full overflow-x-hidden pt-16 bg-custom-black text-custom-seasalt font-sans antialiased selection:bg-custom-accent selection:text-custom-black">
        <AntdRegistry>
          <Navbar />
          {children}
        </AntdRegistry>
        <PhoneButton />
        <Footer />
      </body>
    </html>
  )
}
