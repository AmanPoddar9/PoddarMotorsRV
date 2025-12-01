import BlogNews from '../components/BlogNews';

export const metadata = {
  title: 'Blog & News | Poddar Motors - Automotive Insights & Updates',
  description: 'Stay updated with the latest automotive news, car maintenance tips, new launches, and company updates from Poddar Motors. Expert advice for car buyers in Ranchi, Jharkhand.',
  keywords: 'Poddar Motors blog, car news Ranchi, automotive tips, new car launches, service tips, Maruti Suzuki news, used car buying guide, car maintenance Jharkhand',
  authors: [{ name: 'Poddar Motors' }],
  openGraph: {
    title: 'Blog & News | Poddar Motors',
    description: 'Latest automotive insights and updates from Poddar Motors',
    url: 'https://www.poddarmotors.com/blog',
    siteName: 'Poddar Motors',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: 'https://www.poddarmotors.com/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Poddar Motors Blog',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & News | Poddar Motors',
    description: 'Latest automotive insights and updates from Poddar Motors',
    creator: '@PoddarMotors',
    site: '@PoddarMotors',
  },
  alternates: {
    canonical: 'https://www.poddarmotors.com/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-custom-black via-custom-jet to-custom-black">
      <div className="pt-20">
        <BlogNews />
      </div>
    </main>
  );
}
