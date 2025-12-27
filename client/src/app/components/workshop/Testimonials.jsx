import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Rahul Kumar',
    car: 'Maruti Swift',
    text: 'Excellent service! The staff was very professional and they delivered my car on time. The washing quality was also top-notch.'
  },
  {
    name: 'Priya Singh',
    car: 'Maruti Baleno',
    text: 'I have been servicing my car here for 2 years. Genuine parts and transparent billing. Highly recommended for all Maruti owners.'
  },
  {
    name: 'Amit Verma',
    car: 'Maruti Brezza',
    text: 'Great experience with the denting and painting work. My car looks brand new again. Thanks to the Poddar Motors team.'
  }
]

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-custom-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Customer Testimonials</h2>
          <div className="w-20 h-1 bg-workshop-red mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-custom-jet p-8 rounded-xl border border-white/10 relative">
              <FaQuoteLeft className="text-4xl text-white/10 absolute top-6 left-6" />
              <p className="text-custom-platinum mb-6 relative z-10 pt-4 italic">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-workshop-blue rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-workshop-red">{testimonial.car}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
