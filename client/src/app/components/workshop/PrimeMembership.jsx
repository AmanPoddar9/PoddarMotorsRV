import Link from 'next/link'
import { FaCrown, FaCheckCircle, FaArrowRight } from 'react-icons/fa'

const PrimeMembership = () => {
  return (
    <section id="prime" className="py-16 md:py-24 bg-gradient-to-br from-workshop-blue to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <FaCrown className="text-5xl text-yellow-400" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Poddar Motors <span className="text-yellow-400">Prime</span>
          </h2>
        </div>
        
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Unlock exclusive benefits, priority service, and up to <span className="text-white font-bold">₹15,000</span> in yearly savings.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 text-left">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <FaCheckCircle className="text-yellow-400 text-xl flex-shrink-0" />
            <span className="text-white font-medium">Free Car Washes</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <FaCheckCircle className="text-yellow-400 text-xl flex-shrink-0" />
            <span className="text-white font-medium">Priority Service Lane</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex items-center gap-3">
            <FaCheckCircle className="text-yellow-400 text-xl flex-shrink-0" />
            <span className="text-white font-medium">Discounts on Labor & Parts</span>
          </div>
        </div>

        <Link
          href="/prime-membership"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg px-8 py-4 rounded-full shadow-lg shadow-yellow-500/20 transform hover:scale-105 transition-all duration-300"
        >
          View Plans & Benefits <FaArrowRight />
        </Link>
      </div>
    </section>
  )
}

export default PrimeMembership
