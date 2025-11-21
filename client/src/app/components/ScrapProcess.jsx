'use client'

import Image from 'next/image'
import step1 from '@/images/scrap_step1.png'
import step2 from '@/images/scrap_step2.png'
import step3 from '@/images/scrap_step3.png'
import step4 from '@/images/scrap_step4.png'

const ScrapProcess = () => {
  const steps = [
    {
      number: '1',
      title: 'Submit Details',
      description: 'Fill out our simple form with your car information',
      image: step1,
    },
    {
      number: '2',
      title: 'Get Quote',
      description: 'Receive instant valuation from our scrap experts',
      image: step2,
    },
    {
      number: '3',
      title: 'Free Pickup',
      description: 'We collect your vehicle from your doorstep for free',
      image: step3,
    },
    {
      number: '4',
      title: 'Instant Payment',
      description: 'Get paid immediately via cash, UPI, or bank transfer',
      image: step4,
    },
  ]

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <h2 className="text-center font-bold text-3xl md:text-4xl mb-4 text-custom-black">
          How It Works
        </h2>
        <p className="text-center text-custom-jet mb-12 max-w-2xl mx-auto">
          Scrap your car in 4 simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-custom-seasalt p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 bg-custom-yellow text-custom-black font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                {step.number}
              </div>

              <div className="flex flex-col items-center text-center pt-4">
                <div className="mb-4 w-32 h-32 relative">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-xl mb-3 text-custom-black">
                  {step.title}
                </h3>
                <p className="text-custom-jet text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-custom-yellow text-3xl z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScrapProcess
