import { FaShieldAlt, FaCheckDouble, FaCog, FaMedal } from 'react-icons/fa'

const features = [
  {
    icon: <FaShieldAlt />,
    title: 'Maruti Genuine Parts (MGP)',
    description: 'We use only authorized Maruti Genuine Parts that ensure safety, longevity, and optimal performance of your vehicle.'
  },
  {
    icon: <FaMedal />,
    title: '6-Month Warranty',
    description: 'Enjoy peace of mind with a 6-month / 10,000 km warranty on all labor and parts replaced at our workshop.'
  },
  {
    icon: <FaCog />,
    title: 'Maruti Genuine Accessories (MGA)',
    description: 'Customize your car with a wide range of high-quality MGA, designed perfectly for your Maruti Suzuki.'
  },
  {
    icon: <FaCheckDouble />,
    title: 'Transparent Billing',
    description: 'No hidden charges. We provide detailed job cards and seek your approval for any additional repairs.'
  }
]

const GenuineParts = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-workshop-blue mb-4">
              We Promise <span className="text-workshop-red">Quality & Trust</span>
            </h2>
            <div className="w-20 h-1 bg-workshop-red mb-6"></div>
            <p className="text-gray-600 mb-8 text-lg">
              As an authorized Maruti Suzuki service provider, we adhere to strict quality standards. Your car deserves the best, and we deliver nothing less.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="text-workshop-red text-2xl mt-1 shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual - Abstract Representation */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
             <div className="bg-workshop-blue/5 p-6 rounded-xl border-2 border-dashed border-workshop-blue/20 text-center">
                <h3 className="text-2xl font-bold text-workshop-blue mb-2">Why It Matters?</h3>
                <p className="text-gray-600 mb-6">Using non-genuine parts affects vehicle warranty and safety.</p>
                <div className="flex flex-col gap-3">
                   <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-green-500">
                      <span className="font-semibold text-gray-700">Genuine Parts</span>
                      <span className="text-green-600 font-bold text-sm">TESTED FOR SAFETY</span>
                   </div>
                   <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-red-500 opacity-60">
                      <span className="font-semibold text-gray-700">Fake Parts</span>
                      <span className="text-red-500 font-bold text-sm">UNKNOWN ORIGIN</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GenuineParts
