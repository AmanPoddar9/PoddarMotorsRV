import WorkshopHero from '../components/workshop/WorkshopHero'
import WhyChoose from '../components/workshop/WhyChoose'
import ServicesGrid from '../components/workshop/ServicesGrid'
import Highlights from '../components/workshop/Highlights'
import PrimeMembership from '../components/workshop/PrimeMembership'
import BookingForm from '../components/workshop/BookingForm'
import Testimonials from '../components/workshop/Testimonials'
import AddressMap from '../components/workshop/AddressMap'
import GenuineParts from '../components/workshop/GenuineParts'
import Amenities from '../components/workshop/Amenities'
import EmergencySupport from '../components/workshop/EmergencySupport'
import InsurancePartners from '../components/workshop/InsurancePartners'

export default function WorkshopPage() {
  return (
    <div className="bg-custom-black">
      <WorkshopHero />
      <WhyChoose />
      <ServicesGrid />
      <GenuineParts />
      <EmergencySupport />
      <Highlights />
      <Amenities />
      <PrimeMembership />
      <InsurancePartners />
      <BookingForm />
      <Testimonials />
      <AddressMap />
    </div>
  )
}
