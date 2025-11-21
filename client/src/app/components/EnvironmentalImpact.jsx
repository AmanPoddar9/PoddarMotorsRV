'use client'

import { FaCar, FaRecycle, FaLeaf } from 'react-icons/fa'

const EnvironmentalImpact = () => {
  const stats = [
    {
      icon: <FaCar className="text-5xl text-green-500" />,
      value: '1000+',
      label: 'Cars Scrapped',
      description: 'End-of-life vehicles recycled responsibly',
    },
    {
      icon: <FaRecycle className="text-5xl text-green-500" />,
      value: '500+',
      label: 'Tons Recycled',
      description: 'Metal and materials recovered and reused',
    },
    {
      icon: <FaLeaf className="text-5xl text-green-500" />,
      value: '2000+',
      label: 'Tons CO₂ Saved',
      description: 'Carbon emissions prevented through recycling',
    },
  ]

  return (
    <section className="bg-gradient-to-r from-green-50 to-green-100 py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-custom-black">
          Our Environmental Impact
        </h2>
        <p className="text-center text-custom-jet mb-12 max-w-2xl mx-auto">
          Together, we're making Jharkhand greener by responsibly recycling
          end-of-life vehicles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-4xl font-extrabold text-green-600 mb-2">
                {stat.value}
              </h3>
              <p className="text-xl font-bold text-custom-black mb-2">
                {stat.label}
              </p>
              <p className="text-sm text-custom-jet">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
          <h3 className="font-bold text-xl mb-4 text-custom-black text-center">
            Why Car Scrapping Matters in Jharkhand
          </h3>
          <ul className="space-y-3 text-custom-jet">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Reduces Pollution:</strong> Old vehicles emit harmful
                pollutants. Scrapping removes them from roads.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Conserves Resources:</strong> Recycling metal reduces
                the need for mining and saves natural resources.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Supports Circular Economy:</strong> Recycled materials
                go back into manufacturing, reducing waste.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong>Improves Road Safety:</strong> Removing unfit vehicles
                makes roads safer for everyone.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default EnvironmentalImpact
