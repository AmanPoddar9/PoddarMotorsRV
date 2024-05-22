import AdminNavbar from '@/app/components/AdminNavbar'

const Home = () => {
  return (
    <div>
      <AdminNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-6">
          Admin Dashboard - Poddar Motors
        </h1>
        <p className="text-lg text-gray-600 text-center">
          To update and view requests
        </p>
      </main>
    </div>
  )
}

export default Home
