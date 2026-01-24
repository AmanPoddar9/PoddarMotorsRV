'use client'

import CreateReportForm from '../../../components/admin/CreateReportForm'

// ... imports remain the same

// This component will load the booking data and render the form
function InspectorReportForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [booking, setBooking] = useState(null)
  
  // Verify token on load
  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setError('No token provided. Please use the link sent to you.')
      setLoading(false)
    }
  }, [token])
  
  const verifyToken = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inspections/booking-by-token/${token}`)
      const data = await res.json()
      
      if (!res.ok) {
        if (data.expired) {
          setError('⏰ This link has expired. Please contact admin for a new link.')
        } else if (data.used) {
          setError('✅ This report has already been submitted. Thank you!')
        } else {
          setError(data.error || 'Invalid link. Please contact admin.')
        }
        setLoading(false)
        return
      }
      
      setBooking(data)
      setLoading(false)
      
    } catch (err) {
      console.error('Error verifying token:', err)
      setError('Failed to verify link. Please try again or contact admin.')
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying inspector link...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Link Error</h1>
            <p className="text-gray-300 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <a
                href="tel:+919876543210"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                📞 Call Admin
              </a>
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Render Form directly instead of redirecting
  if (booking) {
    return (
      <CreateReportForm 
        bookingIdProp={booking._id} 
        inspectorModeProp={true} 
        tokenProp={token} 
      />
    )
  }
  
  return null
}

// Main page component with Suspense wrapper
export default function InspectorReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <InspectorReportForm />
    </Suspense>
  )
}
