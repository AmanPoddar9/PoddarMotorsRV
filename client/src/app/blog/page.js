import BlogNews from '../components/BlogNews';


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
      <div className="pt-4">
        <BlogNews />
      </div>
    </main>
  );
}
