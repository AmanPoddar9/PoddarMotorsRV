import Head from 'next/head'

const Videos = () => {
  const videoData = [
    {
      id: 'JcqdIqcY-Jw', // Replace with actual video IDs
      title: 'Car Review: Model X',
      description:
        'An in-depth review of the Model X, showcasing its features and performance.',
    },
    {
      id: 'JcqdIqcY-Jw', // Replace with actual video ID
      title: 'Test Drive: Model Y',
      description:
        'Join us as we take the Model Y for a test drive and explore its capabilities.',
    },
    {
      id: 'your_third_video_id', // Replace with actual video ID
      title: 'Top 5 Cars of 2024',
      description: 'Our selection of the top 5 cars to consider in 2024.',
    },
    {
      id: 'your_fourth_video_id', // Replace with actual video ID
      title: 'Luxury Cars Overview',
      description:
        'A detailed look at some of the most luxurious cars available today.',
    },
    {
      id: 'your_fifth_video_id', // Replace with actual video ID
      title: 'Eco-Friendly Cars',
      description:
        'Discover the best eco-friendly cars for a sustainable future.',
    },
    {
      id: 'your_sixth_video_id', // Replace with actual video ID
      title: 'Affordable Cars Under 10 Lakhs',
      description:
        'Our picks for the best budget-friendly cars available right now.',
    },
    // Add more video objects as needed
  ]

  return (
    <div className="p-6">
      <Head>
        <title>Videos | Poddar Motors Real Value</title>
        <meta
          name="description"
          content="Watch our latest car videos and reviews."
        />
        <meta
          name="keywords"
          content="car videos, car reviews, Poddar Motors"
        />
      </Head>
      <h1 className="text-3xl font-bold mb-4 text-center">Our Car Videos</h1>
      <p className="mb-8 text-center">
        Welcome to our video gallery! Here, you can watch our latest car
        reviews, test drives, and much more. Stay updated with the latest in the
        automotive world and get insights into your favorite cars.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoData.map((video) => (
          <div
            key={video.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <iframe
              width="100%"
              height="215"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="p-4">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-700">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Videos
