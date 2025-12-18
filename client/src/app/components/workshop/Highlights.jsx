const stats = [
  { number: '15+', label: 'Years Experience' },
  { number: '50k+', label: 'Cars Serviced' },
  { number: '20+', label: 'Expert Staff' },
  { number: '100%', label: 'Customer Satisfaction' }
]

const Highlights = () => {
  return (
    <section id="highlights" className="py-16 md:py-24 bg-workshop-blue text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-300 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Highlights
