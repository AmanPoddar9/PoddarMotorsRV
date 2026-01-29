'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDownload, FiPlus, FiTrash2 } from 'react-icons/fi'
import API_URL from '../../../../config/api'

const EmployeeDetailPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview') // overview, documents, assets

    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/employees/${id}`)
            setEmployee(res.data)
        } catch (error) {
            console.error('Error fetching employee:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchEmployee()
    }, [id])

    if (loading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>
    if (!employee) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Employee not found</div>

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <Link href="/admin/hr/staff" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
                    <FiArrowLeft /> Back to Staff List
                </Link>

                {/* Profile Header */}
                <div className="bg-custom-jet/30 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 bg-gradient-to-br from-custom-accent to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{employee.firstName} {employee.lastName}</h1>
                                <p className="text-xl text-custom-accent mb-4">{employee.designation}</p>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2"><FiBriefcase /> {employee.department}</div>
                                    <div className="flex items-center gap-2"><FiMail /> {employee.email}</div>
                                    <div className="flex items-center gap-2"><FiPhone /> {employee.phone}</div>
                                    <div className="flex items-center gap-2"><FiMapPin /> {employee.currentAddress || 'No Address'}</div>
                                </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                employee.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                                {employee.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 mb-8">
                    {['overview', 'documents', 'assets'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize transition-colors relative ${
                                activeTab === tab ? 'text-custom-accent' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-custom-accent" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Section title="Personal Details">
                                <Detail label="Date of Birth" value={new Date(employee.dob).toLocaleDateString()} />
                                <Detail label="Gender" value={employee.gender} />
                                <Detail label="Blood Group" value={employee.bloodGroup} />
                                <Detail label="Permanent Address" value={employee.permanentAddress} />
                            </Section>
                            <Section title="Emergency Contact">
                                <Detail label="Name" value={employee.emergencyContact?.name} />
                                <Detail label="Relation" value={employee.emergencyContact?.relation} />
                                <Detail label="Phone" value={employee.emergencyContact?.phone} />
                            </Section>
                             <Section title="Bank Details">
                                <Detail label="Bank Name" value={employee.bankDetails?.bankName} />
                                <Detail label="Account Number" value={employee.bankDetails?.accountNumber} />
                                <Detail label="IFSC Code" value={employee.bankDetails?.ifscCode} />
                            </Section>
                        </motion.div>
                    )}

                    {activeTab === 'documents' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Documents & Contracts</h3>
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                                    <FiPlus /> Upload Doc
                                </button>
                            </div>
                            {employee.documents?.length === 0 ? (
                                <div className="text-gray-500 italic">No documents uploaded yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {employee.documents.map((doc, idx) => (
                                        <div key={idx} className="bg-custom-jet/30 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                                    <FiDownload />
                                                </div>
                                                <div>
                                                    <p className="font-bold">{doc.title}</p>
                                                    <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-custom-accent hover:underline text-sm">View</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'assets' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Assigned Assets</h3>
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                                    <FiPlus /> Assign Asset
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400">
                                        <tr>
                                            <th className="p-4 rounded-tl-xl">Item Name</th>
                                            <th className="p-4">Identifier / Serial</th>
                                            <th className="p-4">Assigned Date</th>
                                            <th className="p-4 rounded-tr-xl">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {employee.assets?.length === 0 ? (
                                             <tr><td colSpan="4" className="p-4 text-center text-gray-500">No assets assigned.</td></tr>
                                        ) : (
                                            employee.assets.map((asset, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-4 font-bold">{asset.itemName}</td>
                                                    <td className="p-4 text-gray-400 font-mono">{asset.identifier}</td>
                                                    <td className="p-4 text-gray-400">{new Date(asset.assignedDate).toLocaleDateString()}</td>
                                                    <td className="p-4">
                                                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs uppercase font-bold">
                                                            {asset.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

const Section = ({ title, children }) => (
    <div className="bg-custom-jet/20 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-bold text-custom-accent mb-4 border-b border-white/10 pb-2">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
)

const Detail = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-400">{label}</span>
        <span className="font-medium text-white">{value || '-'}</span>
    </div>
)

export default EmployeeDetailPage
