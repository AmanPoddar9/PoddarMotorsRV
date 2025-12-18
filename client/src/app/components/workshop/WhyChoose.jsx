import { FiTool, FiAward, FiClock, FiCheckCircle } from 'react-icons/fi'

const features = [
  {
    icon: <FiTool className="w-8 h-8" />,
    title: 'State-of-the-art Equipment',
    description: 'We use the latest diagnostic tools and equipment recommended by Maruti Suzuki.'
  },
  {
    icon: <FiAward className="w-8 h-8" />,
    title: 'Certified Technicians',
    description: 'Our team consists of highly trained and certified professionals who know your car best.'
  },
  {
    icon: <FiClock className="w-8 h-8" />,
    title: 'Timely Delivery',
    description: 'We value your time and ensure your vehicle is ready when promised.'
  },
  {
    icon: <FiCheckCircle className="w-8 h-8" />,
    title: 'Genuine Parts',
    description: 'We use only 100% genuine Maruti Suzuki parts for longevity and performance.'
  }
]

const WhyChoose = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-workshop-blue mb-4">Why Choose Poddar Motors?</h2>
          <div className="w-20 h-1 bg-workshop-red mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We are committed to providing the highest quality service for your vehicle with transparency and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-workshop-gray rounded-lg hover:shadow-lg transition-shadow duration-300 border-b-4 border-transparent hover:border-workshop-red group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-workshop-blue mb-6 shadow-sm group-hover:bg-workshop-blue group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
