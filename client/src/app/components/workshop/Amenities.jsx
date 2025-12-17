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
    <section className="py-20 bg-workshop-blue text-white overflow-hidden relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-workshop-red opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience Comfort While You Wait</h2>
          <div className="w-20 h-1 bg-white mx-auto opacity-50"></div>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
             Service taking a while? Relax in our premium customer lounge designed for your comfort and productivity.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {amenities.map((item, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl mb-4 text-workshop-red">
                {item.icon}
              </div>
              <span className="font-medium text-sm text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Amenities
