// pages/blog/[id].js
import { useRouter } from 'next/router'

// Static data for articles
const articles = {
  1: {
    title: 'How to Choose a Used Car',
    content:
      'Choosing the right used car involves considering various factors...',
  },
  2: {
    title: 'Maintaining Your Used Car',
    content:
      'Regular maintenance is key to prolonging the life of your used car...',
  },
  3: {
    title: 'Financing Options for Used Cars',
    content:
      'Understanding your financing options can help you make a better decision...',
  },
}

const BlogPost = () => {
  const router = useRouter()
  const { id } = router.query
  const article = articles[id]

  if (!article) {
    return <div>Loading...</div> // Loading state
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{article.title}</h1>
      <p>{article.content}</p>
    </div>
  )
}

export default BlogPost
