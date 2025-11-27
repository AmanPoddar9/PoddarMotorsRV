import { Inter, Outfit } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PhoneButton from './components/PhoneButton'
import WhatsAppWidget from './components/WhatsAppWidget'
import { CustomerProvider } from './utils/customerContext'
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
  // We need to handle client-side logic for pathname
  // Since this is a Server Component, we can't use usePathname directly here.
  // However, we can make the body class dynamic or wrap the content.
  // Actually, RootLayout is a Server Component by default in Next.js 13+.
  // We can't use usePathname here.
  // Alternative: Move the body content to a Client Component or just accept that we might need a different layout for workshop.
  // But Next.js 13 allows nested layouts.
  // The issue is the global `pt-16` in `layout.js`.
  // We should remove `pt-16` from here and add it to the Navbar component (as a spacer) or to the page wrappers.
  // Or, we can make a Client Component wrapper for the body class.
  
  // Let's try a simpler approach: The Navbar is fixed, so it needs space.
  // If we move `pt-16` to a div wrapping `{children}`, it might work, but Navbar is outside.
  // Let's create a Client Component to handle the body class or just move the padding logic to the pages.
  
  // Actually, the easiest way is to make a client component that wraps the body content and handles the class.
  // But for now, let's just remove `pt-16` from global layout and add it to the specific pages or a wrapper.
  
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
      <body className="w-full overflow-x-hidden bg-custom-black text-custom-seasalt font-sans antialiased selection:bg-custom-accent selection:text-custom-black">
        <AntdRegistry>
          <CustomerProvider>
            <Navbar />
            <div className="pt-16 has-[.workshop-layout]:pt-0">
               {children}
            </div>
            <PhoneButton />
            <WhatsAppWidget />
            <Footer />
          </CustomerProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
