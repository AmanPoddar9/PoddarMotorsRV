import { Inter, Outfit } from 'next/font/google'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import './globals.css'
import dynamicImport from 'next/dynamic'

const Navbar = dynamicImport(() => import('./components/Navbar'), { ssr: false })
const Footer = dynamicImport(() => import('./components/Footer'), { ssr: false })
const WhatsAppWidget = dynamicImport(() => import('./components/WhatsAppWidget'), { ssr: false })
const ChatBot = dynamicImport(() => import('./components/ChatBot'), { ssr: false })
import { Providers } from './providers'
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
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#F59E0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Force dynamic rendering to avoid SSR/SSG issues with client-side context
// export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Performance Hints */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://realvaluestorage.s3.ap-south-1.amazonaws.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        
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
            
            // Web Vitals tracking
            function sendToGoogleAnalytics({name, delta, id}) {
              gtag('event', name, {
                event_category: 'Web Vitals',
                value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                event_label: id,
                non_interaction: true,
              });
            }
          `}
        </Script>
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              "name": "Poddar Motors Real Value",
              "description": "Trusted used car dealer in Ranchi, Jharkhand. Best prices for second hand cars.",
              "url": "https://poddarmotors.com",
              "telephone": "+918709119090",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Near Oxford School, Pragati Path, Upper Chutia",
                "addressLocality": "Ranchi",
                "addressRegion": "Jharkhand",
                "postalCode": "834001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "23.36", 
                "longitude": "85.33"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:30",
                "closes": "19:00"
              },
              "sameAs": [
                "https://www.facebook.com/RealValueRanchi",
                "https://www.instagram.com/pmplrealvalue/"
              ],
              "priceRange": "₹₹"
            }
          `}
        </Script>
        
        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ud8szmgdqo");
          `}
        </Script>
      </head>
      <body className="w-full overflow-x-hidden bg-custom-black text-custom-seasalt font-sans antialiased selection:bg-custom-accent selection:text-custom-black">
        <AntdRegistry>
          <Providers>
            <Navbar />
            {children}
            <Footer />
            <WhatsAppWidget />
            <ChatBot />
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  )
}
