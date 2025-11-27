import WorkshopHero from '../components/workshop/WorkshopHero'
import WhyChoose from '../components/workshop/WhyChoose'
import ServicesGrid from '../components/workshop/ServicesGrid'
import Highlights from '../components/workshop/Highlights'
import PrimeMembership from '../components/workshop/PrimeMembership'
import BookingForm from '../components/workshop/BookingForm'
import Testimonials from '../components/workshop/Testimonials'
import AddressMap from '../components/workshop/AddressMap'

export default function WorkshopPage() {
  return (
    <div className="bg-white">
      <WorkshopHero />
      <WhyChoose />
      <ServicesGrid />
      <Highlights />
      <PrimeMembership />
      <BookingForm />
      <Testimonials />
      <AddressMap />
    </div>
  )
}
