'use client'

import {
  FaMoneyBillWave,
  FaTruck,
  FaLeaf,
  FaFileAlt,
  FaTag,
  FaHandshake,
} from 'react-icons/fa'

const ScrapBenefits = () => {
  const benefits = [
    {
      icon: <FaMoneyBillWave className="text-5xl text-custom-yellow" />,
      title: 'Quick Cash',
      description:
        'Get instant payment for your old car. We offer competitive prices based on current scrap metal rates.',
    },
    {
      icon: <FaTruck className="text-5xl text-custom-yellow" />,
      title: 'Free Pickup',
      description:
        'We provide free doorstep pickup service anywhere in Ranchi, Bokaro, Jamshedpur, and surrounding areas.',
    },
    {
      icon: <FaLeaf className="text-5xl text-custom-yellow" />,
      title: 'Eco-Friendly',
      description:
        "Contribute to environmental conservation. We recycle 95% of your vehicle's materials responsibly.",
    },
    {
      icon: <FaFileAlt className="text-5xl text-custom-yellow" />,
      title: 'Legal Documentation',
      description:
        'Complete paperwork assistance including RC cancellation and deregistration certificates.',
    },
    {
      icon: <FaTag className="text-5xl text-custom-yellow" />,
      title: 'Best Price Guaranteed',
      description:
        'Fair market value assessment. We ensure you get the maximum price for your scrap vehicle.',
    },
    {
      icon: <FaHandshake className="text-5xl text-custom-yellow" />,
      title: 'Hassle-Free Process',
      description:
        "Simple 4-step process from quote to payment. We handle everything so you don't have to worry.",
    },
  ]

  return (
    <section className="bg-custom-seasalt py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-custom-black">
          Why Scrap Your Car With Us?
        </h2>
        <p className="text-center text-custom-jet mb-12 max-w-2xl mx-auto">
          We make car scrapping simple, rewarding, and environmentally
          responsible
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-custom-yellow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-custom-black">
                  {benefit.title}
                </h3>
                <p className="text-custom-jet text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScrapBenefits
