import SellRequestForm from '../../components/SellRequestForm'

export const metadata = {
  title: 'Sell Your Car | Poddar Motors',
  description: 'Submit your car details to get the best valuation from Poddar Motors.',
}

export default function SellRequestPage() {
  return (
    <div className="bg-custom-black min-h-screen text-custom-seasalt font-sans pt-24 pb-10 px-4 md:px-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Sell Your Car</h1>
          <p className="text-gray-400">Fill in the details to get an instant valuation</p>
        </div>
        <SellRequestForm />
      </div>
    </div>
  )
}
