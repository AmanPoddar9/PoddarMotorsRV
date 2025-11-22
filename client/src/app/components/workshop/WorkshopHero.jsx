import Link from 'next/link'
import Image from 'next/image'

const WorkshopHero = () => {
  return (
    <section className="relative w-full h-[85vh] flex items-center overflow-hidden bg-workshop-blue">
      {/* Background Image/Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder for workshop image - using a gradient for now if no image available */}
        <div className="absolute inset-0 bg-gradient-to-r from-workshop-blue via-workshop-blue/90 to-transparent z-10"></div>
        {/* You can replace this with an actual image later */}
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl text-white">
          <div className="inline-block px-4 py-1 bg-workshop-red text-white text-sm font-bold uppercase tracking-wider mb-6 rounded-sm">
            Authorized Service Zone
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Expert Care for Your <span className="text-workshop-red">Maruti Suzuki</span>
          </h1>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
            Experience dealership-quality service with state-of-the-art equipment and certified technicians. Your car deserves the best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#book-service"
              className="px-8 py-4 bg-workshop-red text-white font-bold text-lg rounded hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/30 text-center"
            >
              Book a Service
            </Link>
            <Link
              href="#services"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-lg rounded hover:bg-white/20 transition-all duration-300 text-center"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-4 bg-workshop-red"></div>
      <div className="absolute bottom-4 right-0 w-1/4 h-4 bg-white"></div>
    </section>
  )
}

export default WorkshopHero
