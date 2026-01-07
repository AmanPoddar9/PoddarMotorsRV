'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import API_URL from '../../config/api'
import * as XLSX from 'xlsx'
import moment from 'moment'

const SellRequestsPage = () => {
  const [sellRequests, setSellRequests] = useState([])
  const [archivedSellRequests, setArchivedSellRequests] = useState([])
  const [showArchived, setShowArchived] = useState(false)
  
  const fetchSellRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sellRequests`, { withCredentials: true })
      setSellRequests(response.data)
    } catch (error) {
      console.error('Error fetching sell requests:', error)
    }
  }

  const fetchArchivedSellRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sellRequests/archived`, { withCredentials: true })
      setArchivedSellRequests(response.data)
    } catch (error) {
      console.error('Error fetching sell requests:', error)
    }
  }

  useEffect(() => {
    fetchSellRequests()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/sellRequests/${id}`, {
        status,
      }, { withCredentials: true })
      // Refresh sell requests after status change
      fetchSellRequests()
      fetchArchivedSellRequests()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleArchive = async (id, archiveValue) => {
    try {
      await axios.put(`${API_URL}/api/sellRequests/${id}`, {
        archived: archiveValue,
      }, { withCredentials: true })
      // Refresh sell requests after archive
      fetchSellRequests()
      fetchArchivedSellRequests()
    } catch (error) {
      console.error('Error archiving sell request:', error)
    }
  }

  const deleteSellRequest = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/sellRequests/${id}`, { withCredentials: true })
      fetchSellRequests()
      fetchArchivedSellRequests()
    } catch (error) {
      console.error('Error archiving sell request:', error)
    }
  }
  const downloadSellRequests = () => {
    const keysToKeep = [
      'name',
      'phoneNumber',
      'email',
      'location',
      'registrationNumber',
      'brand',
      'model',
      'variant',
      'manufactureYear',
      'kilometers',
      'price',
      'status',
    ]
    const keyToColumnMapping = {
      name: 'Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      location: 'Location',
      registrationNumber: 'Registration Number',
      brand: 'Brand',
      model: 'Model',
      variant: 'Variant',
      manufactureYear: 'Manufacture Year',
      kilometers: 'Kilometers',
      price: 'Expected Price',
      status: 'Status',
    }

    const tempArr = sellRequests.map((item) => {
      const tempObj = {}
      keysToKeep.map((key) => {
        tempObj[keyToColumnMapping[key]] = item[key]
      })
      return tempObj
    })
    const ws = XLSX.utils.json_to_sheet(tempArr)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sell Requests')
    XLSX.writeFile(
      wb,
      `Sell Requests as of ${moment().format('DD-MM-YYYY')}.xlsx`,
    )
  }

  useEffect(() => {
    if (showArchived && !archivedSellRequests.length) {
      fetchArchivedSellRequests()
    }
  }, [showArchived])

  return (
    <div className="min-h-screen bg-custom-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold my-4 text-white pt-8">Sell Requests</h1>
        <div className="text-center my-4">
          <button
            onClick={() => downloadSellRequests()}
            className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-md transition-colors"
          >
            Download Sell Requests
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellRequests.map((request) => (
            <div
              key={request._id}
              className="border border-white/10 bg-custom-jet p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold text-white">
                {request.brand} {request.model}
              </h2>
              <p className="text-custom-platinum">Location: {request.location}</p>
              <p className="text-custom-platinum">Status: {request.status}</p>
              <p className="text-custom-platinum">Name: {request.name}</p>
              <p className="text-custom-platinum">Mobile No: {request.phoneNumber}</p>
              <p className="text-custom-platinum">
                Email: {request.email ? request.email : 'N/A'}
              </p>
              <p className="text-custom-platinum">Location: {request.location}</p>
              <p className="text-custom-platinum">
                Reg. No.: {request.registrationNumber}
              </p>
              <p className="text-custom-platinum">
                Variant: {request.variant ? request.variant : 'N/A'}
              </p>
              <p className="text-custom-platinum">Year: {request.manufactureYear}</p>
              <p className="text-custom-platinum">
                Expected Price: {request.price ? request.price : 'N/A'}
              </p>

              <button
                className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-lg mt-2 transition-colors"
                onClick={() => handleArchive(request._id, true)}
              >
                Archive
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 mx-4 rounded-lg mt-2 transition-colors"
                onClick={() => deleteSellRequest(request._id)}
              >
                Delete
              </button>
              <select
                className="block appearance-none mt-2 border border-white/10 bg-custom-black text-white py-3 px-4 rounded-lg leading-tight focus:outline-none focus:border-custom-accent"
                onChange={(e) =>
                  handleStatusChange(request._id, e.target.value)
                }
                value={request.status}
              >
                <option value="Created">Created</option>
                <option value="Called">Called</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>

        <div className="my-8">
          {showArchived ? (
            <button
              className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-lg mt-2 transition-colors"
              onClick={() => setShowArchived(false)}
            >
              Hide Archived
            </button>
          ) : (
            <button
              className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-lg mt-2 transition-colors"
              onClick={() => setShowArchived(true)}
            >
              Show Archived
            </button>
          )}
        </div>
        {showArchived && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedSellRequests.map((request) => (
              <div
                key={request._id}
                className="border border-white/10 bg-custom-jet p-4 rounded-lg"
              >
                <h2 className="text-lg font-semibold text-white">
                  {request.brand} {request.model}
                </h2>
                <p className="text-custom-platinum">Location: {request.location}</p>
                <p className="text-custom-platinum">Status: {request.status}</p>
                <p className="text-custom-platinum">Name: {request.name}</p>
                <p className="text-custom-platinum">
                  Mobile No: {request.phoneNumber}
                </p>
                <p className="text-custom-platinum">
                  Email: {request.email ? request.email : 'N/A'}
                </p>
                <p className="text-custom-platinum">Location: {request.location}</p>
                <p className="text-custom-platinum">
                  Reg. No.: {request.registrationNumber}
                </p>
                <p className="text-custom-platinum">
                  Variant: {request.variant ? request.variant : 'N/A'}
                </p>
                <p className="text-custom-platinum">Year: {request.manufactureYear}</p>
                <p className="text-custom-platinum">
                  Expected Price: {request.price ? request.price : 'N/A'}
                </p>

                <button
                  className="bg-custom-accent hover:bg-yellow-400 text-custom-black font-bold px-4 py-2 rounded-lg mt-2 transition-colors"
                  onClick={() => handleArchive(request._id, false)}
                >
                  Unarchive
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 mx-4 rounded-lg mt-2 transition-colors"
                  onClick={() => deleteSellRequest(request._id)}
                >
                  Delete
                </button>
                <select
                  className="block appearance-none mt-2 border border-white/10 bg-custom-black text-white py-3 px-4 rounded-lg leading-tight focus:outline-none focus:border-custom-accent"
                  onChange={(e) =>
                    handleStatusChange(request._id, e.target.value)
                  }
                  value={request.status}
                >
                  <option value="Created">Created</option>
                  <option value="Called">Called</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellRequestsPage
