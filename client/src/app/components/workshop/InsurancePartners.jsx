
const partners = [
  "Maruti Insurance",
  "ICICI Lombard",
  "Bajaj Allianz",
  "HDFC ERGO",
  "The New India Assurance",
  "National Insurance",
  "United India Insurance",
  "Oriental Insurance",
  "SBI General",
  "Reliance General"
]

const InsurancePartners = () => {
  return (
    <section className="py-16 md:py-24 bg-custom-black border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-3xl font-bold text-white mb-4">Cashless Insurance Partners</h2>
          <div className="w-16 h-1 bg-custom-jet mx-auto mb-4"></div>
          <p className="text-custom-platinum max-w-2xl mx-auto">
            Hassle-free claims with our wide network of insurance partners. We handle the paperwork while you relax.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-6 bg-custom-jet rounded-lg border border-white/10 hover:shadow-md transition-shadow">
              <span className="font-semibold text-custom-platinum text-center">{partner}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">* Policies subject to terms and conditions of respective insurance companies.</p>
        </div>
      </div>
    </section>
  )
}

export default InsurancePartners
