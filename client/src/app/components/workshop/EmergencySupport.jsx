import { FaPhoneAlt, FaTruck } from 'react-icons/fa'

const EmergencySupport = () => {
  return (
    <section className="bg-workshop-red py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-workshop-red text-3xl shadow-lg shrink-0 animate-pulse">
              <FaTruck />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Stuck on the road?</h2>
              <p className="text-white/90 text-lg">
                24x7 Roadside Assistance (MOS) & Emergency Support
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <a href="tel:+919876543210" className="bg-white text-workshop-red px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-3 shadow-lg">
                <FaPhoneAlt /> Call Support
             </a>
             <a href="#location" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                Find Nearest Center
             </a>
          </div>

        </div>
      </div>
    </section>
  )
}

export default EmergencySupport
