import { FaQuoteLeft, FaStar } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Rajesh Sharma',
    location: 'Ranchi',
    car: 'Sold Maruti Swift',
    text: 'I was skeptical about selling my car online, but Poddar Motors made it so easy. I got a quote within an hour, and the money was in my account the same day. Best price in Ranchi!',
    rating: 5
  },
  {
    name: 'Sneha Gupta',
    location: 'Jamshedpur',
    car: 'Sold Hyundai i20',
    text: 'The home inspection was very professional. They didn\'t haggle unnecessarily and offered a fair price. The RC transfer was also handled by them completely free.',
    rating: 5
  },
  {
    name: 'Amit Dubey',
    location: 'Bokaro',
    car: 'Sold Honda City',
    text: 'Sold my Honda City in just 24 hours. The process was transparent and quick. Highly recommend them if you want a hassle-free experience.',
    rating: 5
  }
]

const SellTestimonials = () => {
  return (
    <section className="py-20 bg-custom-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Happy Sellers</h2>
          <div className="w-20 h-1 bg-custom-yellow mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-400">Join thousands of satisfied customers who sold their cars to us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-xl relative hover:bg-white/10 transition-colors duration-300">
              <FaQuoteLeft className="text-4xl text-custom-yellow/20 absolute top-6 left-6" />
              
              <div className="flex mb-4 relative z-10 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-custom-yellow text-sm" />
                ))}
              </div>

              <p className="text-gray-300 mb-6 relative z-10 italic">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <div className="w-12 h-12 bg-custom-yellow rounded-full flex items-center justify-center text-custom-black font-bold text-xl">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-xs text-custom-yellow">{testimonial.car}</p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SellTestimonials
