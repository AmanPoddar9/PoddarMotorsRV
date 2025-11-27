import { FaCrown, FaCheckCircle, FaWhatsapp } from 'react-icons/fa'

const benefits = [
  {
    icon: <FaCheckCircle />,
    title: 'Free Oil Changes',
    gold: '2x per year',
    platinum: '4x per year'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Priority Booking',
    gold: 'Skip the queue',
    platinum: 'VIP Fast Track'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Parts Discount',
    gold: '10% off',
    platinum: '15% off'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Exclusive Offers',
    gold: 'Seasonal deals',
    platinum: 'Year-round deals'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Extended Warranty',
    gold: '6 months',
    platinum: '12 months'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Customer Support',
    gold: 'Business hours',
    platinum: '24/7 Support'
  }
]

const PrimeMembership = () => {
  const whatsappNumber = '918888888888' // Replace with actual number
  const message = encodeURIComponent('Hi! I am interested in joining Poddar Prime Membership. Please share more details.')

  return (
    <section id="prime" className="py-20 bg-gradient-to-br from-workshop-blue to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCrown className="text-5xl text-yellow-400" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Poddar Prime Membership
            </h2>
          </div>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Exclusive benefits and priority service for our valued customers
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl text-yellow-400 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <div className="space-y-2 text-blue-100">
                <p className="text-sm">Gold: {benefit.gold}</p>
                <p className="text-sm">Platinum: {benefit.platinum}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Gold Tier */}
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <FaCrown className="text-4xl text-yellow-900" />
              <h3 className="text-3xl font-bold text-yellow-900">Gold</h3>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold text-yellow-900">₹2,999</span>
              <span className="text-yellow-800 ml-2">/year</span>
            </div>
            <ul className="space-y-3 text-yellow-900 mb-6">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-800" />
                2 Free Oil Changes
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-800" />
                Priority Booking
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-800" />
                10% Parts Discount
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-yellow-800" />
                6 Months Warranty
              </li>
            </ul>
          </div>

          {/* Platinum Tier */}
          <div className="bg-gradient-to-br from-gray-300 to-gray-400 p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-400">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaCrown className="text-4xl text-gray-800" />
              <h3 className="text-3xl font-bold text-gray-800">Platinum</h3>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-800">₹4,999</span>
              <span className="text-gray-700 ml-2">/year</span>
            </div>
            <ul className="space-y-3 text-gray-800 mb-6">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-gray-700" />
                4 Free Oil Changes
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-gray-700" />
                VIP Fast Track Service
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-gray-700" />
                15% Parts Discount
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-gray-700" />
                12 Months Warranty
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-gray-700" />
                24/7 Support
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-10 py-5 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <FaWhatsapp className="text-3xl" />
            Join Prime Today
          </a>
          <p className="text-blue-100 mt-4 text-sm">
            Contact us on WhatsApp to activate your membership
          </p>
        </div>
      </div>
    </section>
  )
}

export default PrimeMembership
