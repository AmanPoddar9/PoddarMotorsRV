'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import API_URL from '../../config/api'

export default function BookPdiPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [minDate, setMinDate] = useState('')

  useEffect(() => {
    setMinDate(new Date().toISOString().split('T')[0])
  }, [])

  const [formData, setFormData] = useState({
    // Service Type
    type: 'PDI',

    // Customer Details
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Car Details
    brand: '',
    model: '',
    variant: '',
    vin: '', // Optional/Required based on availability
    fuelType: 'Petrol',
    transmissionType: 'Manual',
    
    // Dealer Details (New for PDI)
    dealerName: '',
    dealerSalesperson: '',
    dealerBookingRef: '',

    // Appointment
    appointmentDate: '',
    appointmentTimeSlot: '',
    address: '', // Will be Dealer Address
    city: '',
    pincode: '',
    
    // Payment
    inspectionFee: 999 
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const fetchAvailableSlots = async (date) => {
    setLoadingSlots(true)
    try {
      const res = await fetch(`${API_URL}/api/inspections/slots/available?date=${date}`)
      const data = await res.json()
      setAvailableSlots(data)
    } catch (error) {
      console.error('Error fetching slots:', error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setFormData({ ...formData, appointmentDate: date, appointmentTimeSlot: '' })
    if (date) {
      fetchAvailableSlots(date)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.customerName || !formData.customerPhone) {
        alert('Please fill in all customer details')
        return false
      }
      if (formData.customerPhone.length !== 10) {
        alert('Phone number must be 10 digits')
        return false
      }
    } else if (step === 2) {
      if (!formData.brand || !formData.model) {
        alert('Please fill in Brand and Model')
        return false
      }
    } else if (step === 3) {
      if (!formData.dealerName || !formData.address || !formData.city || !formData.pincode) {
        alert('Please fill in Dealer Name and Location')
        return false
      }
    } else if (step === 4) {
      if (!formData.appointmentDate || !formData.appointmentTimeSlot) {
        alert('Please select appointment date and time')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(4)) return
    
    setLoading(true)
    
    try {
      const bookingPayload = {
        type: 'PDI',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        
        // Car
        brand: formData.brand,
        model: formData.model,
        variant: formData.variant,
        fuelType: formData.fuelType,
        transmissionType: formData.transmissionType,
        vin: formData.vin,
        
        // Dealer Info (Mapped to dealerDetails object)
        dealerDetails: {
            name: formData.dealerName,
            salespersonName: formData.dealerSalesperson,
            bookingReference: formData.dealerBookingRef
        },
        
        // Appointment
        appointmentDate: formData.appointmentDate,
        appointmentTimeSlot: formData.appointmentTimeSlot,
        inspectionLocation: {
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        
        // PDI Defaults
        inspectionFee: 999,
        paymentStatus: 'Paid', // Assuming instant payment for MVP
        kmDriven: 0 // Default for PDI
      }

      console.log('Submitting Booking:', bookingPayload)

      const bookingRes = await fetch(`${API_URL}/api/inspections/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      })

      const bookingData = await bookingRes.json()

      if (!bookingRes.ok) {
        console.error('Booking failed:', bookingData)
        alert(bookingData.error || 'Booking failed')
        setLoading(false)
        return
      }

      // Success - Redirect to confirmation
      router.push(`/inspection/confirmation?ref=${bookingData.bookingReference}`)

    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const brands = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Renault', 'Volkswagen', 'Skoda', 'MG', 'Nissan', 'BMW', 'Mercedes', 'Audi', 'Other']

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Book New Car PDI</h1>
          <p className="text-gray-400 mt-2">Ensure your new car is perfect before registration.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${currentStep >= step ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {step}
                </div>
                <span className={`${currentStep >= step ? 'text-blue-400' : 'text-gray-500'}`}>
                    {step === 1 ? 'Customer' : step === 2 ? 'Car' : step === 3 ? 'Dealer' : step === 4 ? 'Slot' : 'Pay'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Your Contact Details</h2>
                <Input label="Full Name" name="customerName" value={formData.customerName} onChange={handleChange} required />
                <Input label="Phone Number" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required />
                <Input label="Email (Optional)" name="customerEmail" value={formData.customerEmail} onChange={handleChange} type="email"/>
                
                <Button onClick={nextStep}>Next: Car Details</Button>
              </div>
            )}

            {/* Step 2: Car Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Vehicle Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Brand *</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <Input label="Model (e.g. Nexon, Creta)" name="model" value={formData.model} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Variant (Optional)" name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g. Z8L, Top Model" />
                  <Input label="VIN / Booking Ref (If available)" name="vin" value={formData.vin} onChange={handleChange} placeholder="Optional for now" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Fuel Type" name="fuelType" value={formData.fuelType} onChange={handleChange} options={['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']} />
                    <Select label="Transmission" name="transmissionType" value={formData.transmissionType} onChange={handleChange} options={['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']} />
                </div>

                <div className="flex gap-4">
                    <Button onClick={prevStep} secondary>Back</Button>
                    <Button onClick={nextStep}>Next: Dealer Info</Button>
                </div>
              </div>
            )}

            {/* Step 3: Dealer Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Dealer & Location</h2>
                <p className="text-gray-400 text-sm mb-4">Where should our inspector go?</p>

                <Input label="Showroom / Dealer Name *" name="dealerName" value={formData.dealerName} onChange={handleChange} placeholder="e.g. Poddar Motors, Worli" required />
                <Input label="Salesperson Name (Optional)" name="dealerSalesperson" value={formData.dealerSalesperson} onChange={handleChange} placeholder="Helps us coordinate entry" />
                
                <div className="mt-6 border-t border-slate-700 pt-6">
                    <label className="block text-lg font-semibold mb-4">Showroom / Yard Address</label>
                    <Input label="Address Line *" name="address" value={formData.address} onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Input label="City *" name="city" value={formData.city} onChange={handleChange} required />
                        <Input label="Pincode *" name="pincode" value={formData.pincode} onChange={handleChange} required maxLength={6} />
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Button onClick={prevStep} secondary>Back</Button>
                    <Button onClick={nextStep}>Next: Schedule</Button>
                </div>
              </div>
            )}

            {/* Step 4: Appointment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-6">Schedule Inspection</h2>
                
                <Input label="Preferred Date *" type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleDateChange} min={minDate} required />

                {loadingSlots && <p className="text-blue-400 animate-pulse">Checking availability...</p>}

                {availableSlots.length > 0 && (
                  <div>
                    <label className="block text-gray-300 mb-3">Select Time Slot</label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.slot}
                          type="button"
                          onClick={() => setFormData({ ...formData, appointmentTimeSlot: slot.slot })}
                          disabled={!slot.available}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.appointmentTimeSlot === slot.slot
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                              : slot.available 
                                ? 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                                : 'bg-slate-800 border-slate-800 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {slot.slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                    <Button onClick={prevStep} secondary>Back</Button>
                    <Button onClick={nextStep}>Next: Payment</Button>
                </div>
              </div>
            )}

            {/* Step 5: Payment (Mock) */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center">
                 <h2 className="text-2xl font-semibold mb-4">Confirm & Pay</h2>
                 
                 <div className="bg-slate-700 p-6 rounded-xl text-left space-y-2 mb-6">
                    <SummaryRow label="Car" value={`${formData.brand} ${formData.model} (${formData.variant || 'Base'})`} />
                    <SummaryRow label="Dealer" value={formData.dealerName} />
                    <SummaryRow label="Date" value={`${formData.appointmentDate} @ ${formData.appointmentTimeSlot}`} />
                    <SummaryRow label="Fee" value="₹999.00" highlight />
                 </div>

                 <Button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : 'Pay ₹999 & Book Now'}
                 </Button>
                 
                 <Button onClick={prevStep} secondary className="mt-4">Back</Button>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  )
}

// Components for Reusability
const Input = ({ label, secondary, ...props }) => (
    <div className='w-full'>
        <label className="block text-gray-300 mb-2 text-sm">{label}</label>
        <input 
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            {...props}
        />
    </div>
)

const Select = ({ label, options, ...props }) => (
    <div>
        <label className="block text-gray-300 mb-2 text-sm">{label}</label>
        <select 
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
)

const Button = ({ children, secondary, className = '', ...props }) => (
    <button 
        className={`w-full py-3 px-6 rounded-lg font-bold transition-all ${
            secondary 
            ? 'bg-slate-600 hover:bg-slate-500 text-white'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
        } ${className}`}
        {...props}
    >
        {children}
    </button>
)

const SummaryRow = ({ label, value, highlight }) => (
    <div className={`flex justify-between ${highlight ? 'text-xl font-bold text-blue-400 mt-4 border-t border-slate-600 pt-4' : 'text-gray-300'}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
)
