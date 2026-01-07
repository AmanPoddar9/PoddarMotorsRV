import { FaWifi, FaCoffee, FaTv, FaSnowflake, FaNewspaper, FaEye } from 'react-icons/fa'

const amenities = [
  { icon: <FaSnowflake />, label: 'Air Conditioned Lounge' },
  { icon: <FaWifi />, label: 'Free High-Speed Wi-Fi' },
  { icon: <FaCoffee />, label: 'Fresh Coffee & Tea' },
  { icon: <FaTv />, label: 'TV & Entertainment' },
  { icon: <FaNewspaper />, label: 'Newspapers & Magazines' },
  { icon: <FaEye />, label: 'Live Workshop View' }
]

const Amenities = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-workshop-blue opacity-5"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-workshop-red opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience Comfort While You Wait</h2>
          <div className="w-20 h-1 bg-workshop-red mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
             Service taking a while? Relax in our premium customer lounge designed for your comfort and productivity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {amenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="text-3xl mb-4 text-workshop-red group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="font-semibold text-gray-700 text-sm text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Amenities
