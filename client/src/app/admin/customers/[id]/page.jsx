'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '../../../components/AdminNavbar'
import API_URL from '../../../config/api'
import { 
    FiUser, FiPhone, FiMail, FiMapPin, FiTag, FiClock, FiShield, 
    FiShoppingBag, FiTool, FiTarget, FiEdit2, FiSave, FiX, FiPlus, FiTrash2
} from 'react-icons/fi'
import moment from 'moment'
import toast, { Toaster } from 'react-hot-toast'

const CustomerDetailPage = ({ params }) => {
  const { id } = params
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Modal States
  const [modals, setModals] = useState({
      editProfile: false,
      addNote: false,
      manageTags: false,
      addVehicle: false
  })

  // Form Data States
  const [editFormData, setEditFormData] = useState({})
  const [noteContent, setNoteContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tempTags, setTempTags] = useState([])
  const [vehicleForm, setVehicleForm] = useState({})

  useEffect(() => {
    fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer/${id}`, { withCredentials: true })
      setCustomer(response.data)
      
      // Init Edit Form
      setEditFormData({
          name: response.data.name,
          mobile: response.data.mobile,
          email: response.data.email,
          lifecycleStage: response.data.lifecycleStage,
          source: response.data.source,
          areaCity: response.data.areaCity
      })

      // Init Tags
      setTempTags(response.data.tags || [])

    } catch (error) {
      console.error('Error fetching customer:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const toggleModal = (modalName, isOpen = true) => {
      setModals(prev => ({ ...prev, [modalName]: isOpen }))
  }

  // --- ACTIONS ---

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      try {
          await axios.put(`${API_URL}/api/customer/${id}`, editFormData, { withCredentials: true })
          toast.success('Profile updated!')
          toggleModal('editProfile', false)
          fetchCustomer() 
      } catch (error) {
          toast.error('Update failed')
      }
  }

  const handleAddNote = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`${API_URL}/api/customer/${id}/notes`, { note: noteContent }, { withCredentials: true })
          toast.success('Note added')
          setNoteContent('')
          toggleModal('addNote', false)
          fetchCustomer()
      } catch (error) {
          toast.error('Failed to add note')
      }
  }

  const handleSaveTags = async () => {
      try {
          await axios.put(`${API_URL}/api/customer/${id}/tags`, { tags: tempTags }, { withCredentials: true })
          toast.success('Tags updated')
          toggleModal('manageTags', false)
          fetchCustomer()
      } catch (error) {
          toast.error('Failed to update tags')
      }
  }

  const handleAddVehicle = async (e) => {
      e.preventDefault();
      try {
          await axios.post(`${API_URL}/api/customer/${id}/vehicles`, vehicleForm, { withCredentials: true })
          toast.success('Vehicle added to Garage')
          setVehicleForm({})
          toggleModal('addVehicle', false)
          fetchCustomer()
      } catch (error) {
          toast.error('Failed to add vehicle')
      }
  }

  // Tag Helpers
  const addTempTag = (e) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault()
          if (!tempTags.includes(tagInput.trim())) {
              setTempTags([...tempTags, tagInput.trim()])
          }
          setTagInput('')
      }
  }
  const removeTempTag = (tagToRemove) => {
      setTempTags(tempTags.filter(t => t !== tagToRemove))
  }


  if (loading) return <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">Loading...</div>
  if (!customer) return <div className="min-h-screen bg-custom-black text-white flex items-center justify-center">Customer not found</div>

  const tabs = [
      { id: 'overview', label: 'Overview', icon: <FiUser /> },
      { id: 'buying', label: 'Buying', icon: <FiShoppingBag /> },
      { id: 'selling', label: 'Selling', icon: <FiTarget /> },
      { id: 'service', label: 'Service', icon: <FiTool /> },
      { id: 'insurance', label: 'Insurance', icon: <FiShield /> },
  ]

  return (
    <div className="min-h-screen bg-custom-black text-white font-sans relative">
      <AdminNavbar />
      <Toaster />
      
      {/* --- MODALS --- */}

      {/* 1. Edit Profile Modal */}
      {modals.editProfile && (
        <Modal title="Edit Profile" onClose={() => toggleModal('editProfile', false)}>
             <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input label="Full Name" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
                <Input label="Mobile" value={editFormData.mobile} onChange={e => setEditFormData({...editFormData, mobile: e.target.value})} />
                <Input label="Email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} />
                <Input label="City / Area" value={editFormData.areaCity} onChange={e => setEditFormData({...editFormData, areaCity: e.target.value})} />
                
                 <div>
                    <label className="block text-sm text-gray-400 mb-1">Source</label>
                     <select 
                        className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                        value={editFormData.source}
                        onChange={(e) => setEditFormData({...editFormData, source: e.target.value})}
                     >
                         {['Walk-in', 'TeleCRM', 'GoogleSheet', 'Website', 'Workshop', 'Facebook', 'Import', 'Other'].map(s => (
                             <option key={s} value={s}>{s}</option>
                         ))}
                     </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Lifecycle Stage</label>
                     <select 
                        className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                        value={editFormData.lifecycleStage}
                        onChange={(e) => setEditFormData({...editFormData, lifecycleStage: e.target.value})}
                     >
                         {['Lead', 'Prospect', 'Customer', 'Churned'].map(s => (
                             <option key={s} value={s}>{s}</option>
                         ))}
                     </select>
                </div>
                <Button type="submit" icon={<FiSave />} text="Save Changes" />
            </form>
        </Modal>
      )}

      {/* 2. Add Note Modal */}
      {modals.addNote && (
          <Modal title="Add Note" onClose={() => toggleModal('addNote', false)}>
              <form onSubmit={handleAddNote} className="space-y-4">
                  <textarea 
                    className="w-full h-32 bg-black/40 border border-white/10 rounded p-4 text-white focus:border-custom-accent focus:outline-none resize-none"
                    placeholder="Type note here..."
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                    required
                  ></textarea>
                  <Button type="submit" icon={<FiPlus />} text="Add Note" />
              </form>
          </Modal>
      )}

      {/* 3. Manage Tags Modal */}
      {modals.manageTags && (
          <Modal title="Manage Tags" onClose={() => toggleModal('manageTags', false)}>
              <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 p-4 bg-black/20 rounded min-h-[50px] border border-white/5">
                      {tempTags.map((tag, i) => (
                          <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-sm rounded">
                              {tag}
                              <button onClick={() => removeTempTag(tag)} className="hover:text-red-400"><FiX /></button>
                          </span>
                      ))}
                  </div>
                  <input 
                    className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none"
                    placeholder="Type tag and press Enter..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTempTag}
                  />
                  <Button onClick={handleSaveTags} icon={<FiSave />} text="Save Tags" />
              </div>
          </Modal>
      )}

      {/* 4. Add Vehicle (Garage) Modal */}
       {modals.addVehicle && (
          <Modal title="Add Vehicle to Garage" onClose={() => toggleModal('addVehicle', false)}>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                  <Input label="Reg Number" required onChange={e => setVehicleForm({...vehicleForm, regNumber: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Make" placeholder="e.g. Maruti" onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})} />
                    <Input label="Model" placeholder="e.g. Swift" onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} />
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                     <Input label="Variant" placeholder="e.g. VXI" onChange={e => setVehicleForm({...vehicleForm, variant: e.target.value})} />
                     <Input label="Year" placeholder="e.g. 2020" onChange={e => setVehicleForm({...vehicleForm, yearOfManufacture: e.target.value})} />
                   </div>
                  <Button type="submit" icon={<FiPlus />} text="Add Vehicle" />
              </form>
          </Modal>
      )}


      {/* --- PAGE CONTENT --- */}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-custom-jet to-gray-900 rounded-xl p-8 border border-white/10 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <FiUser className="w-64 h-64 text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white">{customer.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            customer.primeStatus?.isActive ? 'bg-yellow-900/50 text-yellow-500 border-yellow-600' : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}>
                            {customer.primeStatus?.isActive ? `PRIME ${customer.primeStatus.tier}` : 'Standard'}
                        </span>
                   </div>
                   <div className="flex flex-wrap gap-6 text-custom-platinum text-sm">
                        <span className="flex items-center gap-2"><FiPhone className="text-custom-accent"/> {customer.mobile}</span>
                        <span className="flex items-center gap-2"><FiMail className="text-custom-accent"/> {customer.email || 'No Email'}</span>
                        <span className="flex items-center gap-2"><FiMapPin className="text-custom-accent"/> {customer.areaCity || 'Unknown City'}</span>
                   </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => toggleModal('editProfile', true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                    >
                        <FiEdit2 /> Edit Profile
                    </button>
                    <button 
                        onClick={() => toggleModal('addNote', true)}
                        className="flex items-center gap-2 px-4 py-2 bg-custom-accent text-custom-black font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        <FiPlus /> Add Note
                    </button>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 border-b border-white/10 pb-1">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-custom-accent text-custom-black' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LEFT: Main Content */}
            <div className="md:col-span-2 space-y-6">
                
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Lifecycle" value={customer.lifecycleStage} color="blue" />
                            <StatCard label="Source" value={customer.source} color="purple" />
                        </div>

                         <div className="bg-custom-jet rounded-xl border border-white/10 p-6">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2"><FiClock /> Timeline & Notes</h3>
                                <button onClick={() => toggleModal('addNote', true)}className="text-custom-accent text-sm hover:underline">+ Add Note</button>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto">
                                {customer.notes && customer.notes.length > 0 ? (
                                    [...customer.notes].reverse().map((note, i) => (
                                        <div key={i} className="border-l-2 border-custom-accent pl-4 py-1">
                                            <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                                            <span className="text-xs text-gray-500">{moment(note.createdAt).format('DD MMM, hh:mm A')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 italic text-sm">No notes added yet.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs (Simplified for brevity, logic remains same as previous step just ensuring they render) */}
                {activeTab === 'buying' && <BuyingTab customer={customer} />}
                {activeTab === 'selling' && <SellingTab customer={customer} />}
                {activeTab === 'service' && <ServiceTab customer={customer} />}
                {activeTab === 'insurance' && <InsuranceTab customer={customer} />}
            
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-6">
                
                {/* ID Card */}
                <div className="bg-custom-jet rounded-xl border border-white/10 p-6">
                    <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-bold">System IDs</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-gray-400">Custom ID</span><span className="font-mono text-white">{customer.customId || 'N/A'}</span></div>
                         <div className="flex justify-between"><span className="text-gray-400">Database ID</span><span className="font-mono text-xs text-gray-600">{customer._id}</span></div>
                    </div>
                </div>

                {/* Garage */}
                 <div className="bg-custom-jet rounded-xl border border-white/10 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold">Garage ({customer.vehicles?.length || 0})</h3>
                        <button onClick={() => toggleModal('addVehicle', true)} className="text-custom-accent text-xs hover:underline">+ Add</button>
                    </div>
                     {customer.vehicles && customer.vehicles.length > 0 ? (
                         <div className="space-y-3">
                             {customer.vehicles.map((v, i) => (
                                 <div key={i} className="bg-black/20 p-3 rounded border border-white/5">
                                     <div className="font-bold text-white">{v.regNumber}</div>
                                     <div className="text-xs text-gray-400">{v.make} {v.model} ({v.yearOfManufacture || 'Year?'})</div>
                                 </div>
                             ))}
                         </div>
                     ) : <div className="text-gray-500 text-sm">No vehicles known.</div>}
                </div>

                {/* Tags */}
                <div className="bg-custom-jet rounded-xl border border-white/10 p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm uppercase tracking-wider text-gray-500 font-bold">Tags</h3>
                        <button onClick={() => toggleModal('manageTags', true)} className="text-custom-accent text-xs hover:underline">Manage</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {customer.tags && customer.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs border border-gray-700">{tag}</span>
                        ))}
                         <button onClick={() => toggleModal('manageTags', true)} className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs border border-dashed border-gray-600 hover:text-white">+</button>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}

// --- SUB COMPONENTS ---

const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-custom-jet w-full max-w-md p-6 rounded-xl border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><FiX /></button>
            </div>
            {children}
        </div>
    </div>
)

const Input = ({ label, type="text", ...props }) => (
    <div>
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
        <input type={type} className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white focus:border-custom-accent focus:outline-none" {...props} />
    </div>
)

const Button = ({ onClick, type="button", icon, text }) => (
    <button type={type} onClick={onClick} className="w-full bg-custom-accent hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
        {icon} {text}
    </button>
)

const StatCard = ({ label, value, color }) => {
    const colors = {
        blue: 'bg-blue-900/20 text-blue-400 border-blue-900',
        purple: 'bg-purple-900/20 text-purple-400 border-purple-900',
    }
    return (
        <div className={`p-4 rounded-lg border ${colors[color]}`}>
            <div className="text-sm opacity-70 mb-1">{label}</div>
            <div className="text-xl font-bold">{value}</div>
        </div>
    )
}

// Reusing Tab Content Logic directly or keeping them as simple renders
const BuyingTab = ({ customer }) => (
     <div className="space-y-6">
        <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold">Car Requirements (Leads)</h3>
                <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">Imported Data</span>
            </div>
            <div className="p-0">
                {customer.requirements?.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-4">Looking For</th><th className="p-4">Budget</th><th className="p-4">Status</th></tr></thead>
                        <tbody className="divide-y divide-white/5">
                            {customer.requirements.map(req => (
                                <tr key={req._id}><td className="p-4"><div className="font-bold font-white">{req.brand} {req.model}</div><div className="text-xs text-gray-500">Min Year: {req.yearMin}</div></td><td className="p-4">₹{req.budgetMin} - {req.budgetMax}</td><td className="p-4">{req.isActive ? 'Active' : 'Closed'}</td></tr>
                            ))}
                        </tbody>
                    </table>
                ) : <div className="p-8 text-center text-gray-500">No active requirements.</div>}
            </div>
        </div>
         <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
             <div className="p-4 border-b border-white/10 bg-white/5"><h3 className="font-bold">Test Drive History</h3></div>
            <div className="p-0">
                {customer.testDrives?.length > 0 ? (
                    <table className="w-full text-sm text-left">
                         <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-4">Car</th><th className="p-4">Date</th></tr></thead>
                        <tbody className="divide-y divide-white/5">{customer.testDrives.map(td => (<tr key={td._id}><td className="p-4">{td.listing?.make} {td.listing?.model}</td><td className="p-4">{td.date} {td.time}</td></tr>))}</tbody>
                    </table>
                ) : <div className="p-8 text-center text-gray-500">No test drives booked.</div>}
            </div>
         </div>
    </div>
)

const SellingTab = ({ customer }) => (
     <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5"><h3 className="font-bold">Sell Requests</h3></div>
            <div className="p-0">
                {customer.sellRequests?.length > 0 ? (
                    <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-4">Car</th><th className="p-4">Price</th><th className="p-4">Status</th></tr></thead>
                        <tbody className="divide-y divide-white/5">
                            {customer.sellRequests.map(sr => (
                                <tr key={sr._id}><td className="p-4"><div className="font-bold text-white">{sr.brand} {sr.model}</div><div className="text-xs text-gray-500">{sr.registrationNumber}</div></td><td className="p-4">₹{sr.price}</td><td className="p-4">{sr.status}</td></tr>
                            ))}
                        </tbody>
                    </table>
                ) : <div className="p-8 text-center text-gray-500">No sell requests.</div>}
            </div>
    </div>
)

const ServiceTab = ({ customer }) => (
     <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5"><h3 className="font-bold">Workshop History</h3></div>
             <div className="p-0">
                {customer.workshopBookings?.length > 0 ? (
                    <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-4">Service</th><th className="p-4">Car</th><th className="p-4">Date</th></tr></thead>
                        <tbody className="divide-y divide-white/5">
                            {customer.workshopBookings.map(wb => (<tr key={wb._id}><td className="p-4 font-medium">{wb.serviceType}</td><td className="p-4">{wb.carModel}</td><td className="p-4">{wb.date}</td></tr>))}
                        </tbody>
                    </table>
                ) : <div className="p-8 text-center text-gray-500">No service history.</div>}
            </div>
     </div>
)

const InsuranceTab = ({ customer }) => (
     <div className="bg-custom-jet rounded-xl border border-white/10 overflow-hidden">
             <div className="p-4 border-b border-white/10 bg-white/5"><h3 className="font-bold">Active Policies</h3></div>
             <div className="p-0">
                {customer.policies?.length > 0 ? (
                    <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 border-b border-white/10"><tr><th className="p-4">Policy #</th><th className="p-4">Vehicle</th><th className="p-4">Expiry</th></tr></thead>
                        <tbody className="divide-y divide-white/5">
                            {customer.policies.map(p => (<tr key={p._id}><td className="p-4 font-mono">{p.policyNumber}</td><td className="p-4">{p.vehicle?.regNumber}</td><td className="p-4 text-red-400">{moment(p.policyEndDate).format('DD MMM YYYY')}</td></tr>))}
                        </tbody>
                    </table>
                ) : <div className="p-8 text-center text-gray-500">No active policies.</div>}
            </div>
     </div>
)


export default CustomerDetailPage
