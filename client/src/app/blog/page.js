import BlogNews from '../components/BlogNews';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Blog & News | Poddar Motors - Automotive Insights & Updates',
  description: 'Stay updated with the latest automotive news, car maintenance tips, new launches, and company updates from Poddar Motors.',
  keywords: 'Poddar Motors blog, car news, automotive tips, new car launches, service tips, Maruti Suzuki news',
  openGraph: {
    title: 'Blog & News | Poddar Motors',
    description: 'Latest automotive insights and updates from Poddar Motors',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20">
        <BlogNews />
      </div>
      <Footer />
    </main>
  );
}
