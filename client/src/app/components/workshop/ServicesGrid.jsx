import { FaOilCan, FaCarCrash, FaSprayCan, FaCogs, FaFan, FaBatteryFull } from 'react-icons/fa'

const services = [
  {
    icon: <FaOilCan />,
    title: 'Periodic Maintenance',
    description: 'Regular service to keep your car running smoothly.'
  },
  {
    icon: <FaCarCrash />,
    title: 'Denting & Painting',
    description: 'Restore your car\'s look with our expert body shop services.'
  },
  {
    icon: <FaSprayCan />,
    title: 'Car Spa & Cleaning',
    description: 'Interior and exterior cleaning for a showroom shine.'
  },
  {
    icon: <FaCogs />,
    title: 'General Repairs',
    description: 'Engine, suspension, and brake repairs by experts.'
  },
  {
    icon: <FaFan />,
    title: 'AC Service',
    description: 'Complete air conditioning checkup and servicing.'
  },
  {
    icon: <FaBatteryFull />,
    title: 'Battery & Tyres',
    description: 'Genuine battery and tyre replacement services.'
  }
]

const ServicesGrid = () => {
  return (
    <section id="services" className="py-16 md:py-24 bg-custom-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-workshop-blue mb-2">Services We Offer</h2>
            <div className="w-20 h-1 bg-workshop-red"></div>
          </div>
          <p className="text-custom-platinum max-w-md text-right md:text-left">
            Comprehensive car care solutions tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-custom-jet p-8 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
              <div className="text-4xl text-workshop-red mb-6 opacity-80">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-custom-platinum mb-6">{service.description}</p>
              <a href="#book-service" className="text-white hover:text-workshop-red font-semibold transition-colors flex items-center gap-2 group">
                Book Now <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
