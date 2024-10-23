import Link from 'next/link'

const articles = [
  {
    id: 1,
    title: 'How to Choose a Used Car',
    excerpt: 'Tips on selecting the best used car for your needs.',
  },
  {
    id: 2,
    title: 'Maintaining Your Used Car',
    excerpt: 'Essential maintenance tips for used cars.',
  },
  {
    id: 3,
    title: 'Financing Options for Used Cars',
    excerpt: 'Exploring different financing options available.',
  },
  // Add more articles as needed
]

const Blog = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {articles.map((article) => (
        <Link key={article.id} href={`/blog/${article.id}`}>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p>{article.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Blog
