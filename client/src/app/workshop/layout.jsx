import WorkshopNavbar from '../components/workshop/WorkshopNavbar'

export default function WorkshopLayout({ children }) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 workshop-layout">
      <WorkshopNavbar />
      <main>{children}</main>
    </div>
  )
}
