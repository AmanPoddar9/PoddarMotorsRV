
// ... (keep existing imports)
import { FaCrown, FaCar, FaHeart, FaWrench, FaCog, FaSpinner, FaUser, FaEdit, FaShieldAlt } from 'react-icons/fa' // Added FaEdit, FaShieldAlt
// ...

export default function ProfilePage() {
  const { customer, loading } = useCustomer()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', mobile: '' })
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    if (!loading && !customer) {
      router.push('/login')
    }
    if (customer) {
        setEditForm({ name: customer.name, mobile: customer.mobile })
    }
  }, [customer, loading, router])

  useEffect(() => {
    if (customer) {
      fetchDashboard()
    }
  }, [customer])

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customer/dashboard`, {
        withCredentials: true
      })
      setDashboardData(res.data.dashboard)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
      setSaveLoading(true)
      try {
          await axios.patch(`${API_URL}/api/customer/profile`, editForm, { withCredentials: true })
          setIsEditing(false)
          window.location.reload() // Reload to reflect changes globally
      } catch (error) {
          alert(error.response?.data?.message || 'Error updating profile')
      } finally {
          setSaveLoading(false)
      }
  }

  if (loading || !customer) {
    return (
      <div className="min-h-screen bg-custom-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-custom-accent text-4xl" />
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaUser /> },
    { id: 'requirements', label: 'Car Requirements', icon: <FaCar /> },
    { id: 'garage', label: 'My Garage', icon: <FaWrench /> },
    { id: 'buying', label: 'Car Buying', icon: <FaCrown /> },
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
  ]

  return (
    <div className="min-h-screen bg-custom-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-custom-jet rounded-2xl p-6 border border-white/10 sticky top-28">
              <div className="text-center mb-6 relative">
                 {/* Edit Button */}
                 {!isEditing && (
                     <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute top-0 right-0 text-gray-400 hover:text-white"
                        title="Edit Profile"
                     >
                         <FaEdit />
                     </button>
                 )}

                <div className="w-20 h-20 bg-custom-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-custom-accent">
                    {customer.name.charAt(0)}
                  </span>
                </div>

                {isEditing ? (
                    <div className="space-y-3 mb-4">
                        <input 
                            className="w-full bg-custom-black text-white px-3 py-2 rounded border border-white/20"
                            placeholder="Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        />
                        <input 
                            className="w-full bg-custom-black text-white px-3 py-2 rounded border border-white/20"
                            placeholder="Mobile"
                            value={editForm.mobile}
                            onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                        />
                        <div className="flex gap-2 justify-center">
                            <button 
                                onClick={handleUpdateProfile}
                                disabled={saveLoading}
                                className="bg-custom-accent text-custom-black px-4 py-1 rounded font-bold text-sm"
                            >
                                {saveLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="bg-white/10 text-white px-4 py-1 rounded text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                        <p className="text-custom-platinum text-sm mt-1">{customer.mobile}</p>
                    </>
                )}

                {customer.primeStatus?.isActive && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full">
                    <FaCrown /> {customer.primeStatus.tier} Member
                  </div>
                )}
              </div>
              
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-custom-accent text-custom-black font-bold'
                        : 'text-custom-platinum hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-custom-jet p-6 rounded-xl border border-white/10">
                    <h3 className="text-custom-platinum text-sm">Workshop Bookings</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.workshopBookings?.length || 0}
                    </p>
                  </div>
                  <div className="bg-custom-jet p-6 rounded-xl border border-white/10">
                    <h3 className="text-custom-platinum text-sm">Insurance Policies</h3>
                     <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.insurancePolicies?.length || 0}
                    </p>
                  </div>
                  <div className="bg-custom-jet p-6 rounded-xl border border-white/10">
                    <h3 className="text-custom-platinum text-sm">Offers Made</h3>
                    <p className="text-3xl font-bold text-white mt-2">
                      {dashboardData?.offers?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Insurance Card - NEW */}
                {dashboardData?.insurancePolicies?.length > 0 && (
                     <div className="bg-custom-jet p-6 rounded-xl border border-white/10">
                         <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaShieldAlt className="text-blue-500" /> My Insurance Policies
                         </h2>
                         <div className="space-y-4">
                             {dashboardData.insurancePolicies.map((policy) => (
                                 <div key={policy._id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                     <div>
                                         <h4 className="text-white font-bold">{policy.vehicle?.regNumber} ({policy.vehicle?.make} {policy.vehicle?.model})</h4>
                                         <p className="text-sm text-gray-400">{policy.insurer} • Policy #{policy.policyNumber}</p>
                                         <p className="text-xs text-blue-400 mt-1">Expires: {new Date(policy.policyEndDate).toLocaleDateString()}</p>
                                     </div>
                                     <div>
                                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${policy.renewalStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {policy.renewalStatus}
                                         </span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                )}

                {/* Prime Status Card */}
                <div className={`p-6 rounded-xl border ${
                  customer.primeStatus?.isActive
                    ? 'bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border-yellow-500/30'
                    : 'bg-custom-jet border-white/10'
                }`}>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaCrown className="text-yellow-400" />
                    Prime Membership
                  </h2>
                  {customer.primeStatus?.isActive ? (
                    <div>
                      <p className="text-custom-platinum">Status: <span className="text-yellow-400 font-bold">{customer.primeStatus.tier} Member</span></p>
                      <p className="text-custom-platinum mt-2">Benefits:</p>
                      <ul className="list-disc list-inside text-custom-platinum/80 mt-1">
                        <li>2 Free Car Washes</li>
                        <li>Priority Workshop Booking</li>
                        <li>10% Off on Services</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-custom-platinum">Not a Prime member yet. Upgrade to enjoy exclusive benefits!</p>
                      <button onClick={() => router.push('/workshop')} className="px-4 py-2 bg-custom-accent text-custom-black font-bold rounded-lg text-sm">
                        View Plans
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requirements' && <ProfileRequirements />}

            {activeTab === 'garage' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Workshop Service History</h2>
                {dashboardData?.workshopBookings?.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.workshopBookings.map((booking, idx) => (
                      <div key={idx} className="bg-custom-jet p-6 rounded-xl border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-white">{booking.serviceType}</h3>
                            <p className="text-custom-platinum mt-1">{booking.carModel} • {booking.registrationNumber}</p>
                            <p className="text-sm text-custom-platinum/60 mt-2">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-custom-jet/50 rounded-xl border border-white/5">
                    <p className="text-custom-platinum">No workshop bookings yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'buying' && (
              <div className="space-y-8">
                {/* Test Drives */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Test Drive Requests</h3>
                  {dashboardData?.testDrives?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.testDrives.map((booking, idx) => (
                        <div key={idx} className="bg-custom-jet p-6 rounded-xl border border-white/10">
                          <div className="flex items-start gap-4">
                            {booking.listing?.images?.[0] && (
                              <Image 
                                src={booking.listing.images[0]} 
                                alt="Car" 
                                width={96}
                                height={96}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white">
                                {booking.listing?.brand} {booking.listing?.model}
                              </h4>
                              <p className="text-custom-platinum mt-1">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-custom-platinum">No test drive requests yet.</p>
                  )}
                </div>

                {/* Offers */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Offers</h3>
                  {dashboardData?.offers?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.offers.map((offer, idx) => (
                        <div key={idx} className="bg-custom-jet p-6 rounded-xl border border-white/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-bold text-white">
                                {offer.listing?.brand} {offer.listing?.model}
                              </h4>
                              <p className="text-custom-platinum mt-1">
                                Your Offer: ₹{offer.offerPrice?.toLocaleString()} • 
                                Listed: ₹{offer.listing?.price?.toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              offer.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                              offer.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              offer.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {offer.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-custom-platinum">No offers made yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">My Wishlist</h2>
                {customer.wishlist?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customer.wishlist.filter(item => item && item.brand).map((car, idx) => (
                      <div key={idx} className="bg-custom-jet p-4 rounded-xl border border-white/10">
                        {car.images?.[0] && (
                          <div className="relative w-full h-48 mb-4">
                            <Image 
                              src={car.images[0]} 
                              alt="Car" 
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-white">{car.brand} {car.model}</h3>
                        <p className="text-custom-accent font-bold mt-2">₹{car.price?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-custom-jet/50 rounded-xl border border-white/5">
                    <p className="text-custom-platinum">Your wishlist is empty. Start adding cars you love!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
