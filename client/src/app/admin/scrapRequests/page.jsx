'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNavbar from '@/app/components/AdminNavbar'
import * as XLSX from 'xlsx'
import moment from 'moment'

const ScrapRequestsPage = () => {
  const [scrapRequests, setScrapRequests] = useState([])
  const [archivedScrapRequests, setArchivedScrapRequests] = useState([])
  const [showArchived, setShowArchived] = useState(false)
  let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
  // url = 'http://localhost:5000/'

  const fetchScrapRequests = async () => {
    try {
      const response = await axios.get(url + 'api/scrapRequests?archived=false')
      setScrapRequests(response.data)
    } catch (error) {
      console.error('Error fetching scrap requests:', error)
    }
  }

  const fetchArchivedScrapRequests = async () => {
    try {
      const response = await axios.get(url + 'api/scrapRequests?archived=true')
      setArchivedScrapRequests(response.data)
    } catch (error) {
      console.error('Error fetching archived scrap requests:', error)
    }
  }

  useEffect(() => {
    fetchScrapRequests()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(url + `api/scrapRequests/${id}`, {
        status,
      })
      fetchScrapRequests()
      fetchArchivedScrapRequests()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleArchive = async (id, archiveValue) => {
    try {
      await axios.put(url + `api/scrapRequests/${id}`, {
        archived: archiveValue,
      })
      fetchScrapRequests()
      fetchArchivedScrapRequests()
    } catch (error) {
      console.error('Error archiving scrap request:', error)
    }
  }

  const deleteScrapRequest = async (id) => {
    try {
      await axios.delete(url + `api/scrapRequests/${id}`)
      fetchScrapRequests()
      fetchArchivedScrapRequests()
    } catch (error) {
      console.error('Error deleting scrap request:', error)
    }
  }

  const downloadScrapRequests = () => {
    const keysToKeep = [
      'name',
      'phoneNumber',
      'email',
      'location',
      'registrationNumber',
      'brand',
      'model',
      'manufactureYear',
      'kilometers',
      'condition',
      'carType',
      'preferredPickupDate',
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
      manufactureYear: 'Manufacture Year',
      kilometers: 'Kilometers',
      condition: 'Condition',
      carType: 'Car Type',
      preferredPickupDate: 'Preferred Pickup Date',
      status: 'Status',
    }

    const tempArr = scrapRequests.map((item) => {
      const tempObj = {}
      keysToKeep.map((key) => {
        tempObj[keyToColumnMapping[key]] = item[key]
      })
      return tempObj
    })
    const ws = XLSX.utils.json_to_sheet(tempArr)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Scrap Requests')
    XLSX.writeFile(
      wb,
      `Scrap Requests as of ${moment().format('DD-MM-YYYY')}.xlsx`,
    )
  }

  useEffect(() => {
    if (showArchived && !archivedScrapRequests.length) {
      fetchArchivedScrapRequests()
    }
  }, [showArchived])

  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto min-h-[70vh]">
        <h1 className="text-2xl font-bold my-4">Scrap Requests</h1>
        <div className="text-center my-4">
          <button
            onClick={() => downloadScrapRequests()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download Scrap Requests
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scrapRequests.map((request) => (
            <div
              key={request._id}
              className="border border-gray-200 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-lg font-semibold">
                {request.brand} {request.model}
              </h2>
              <p className="text-gray-600 font-semibold mt-2">
                Status: <span className="text-blue-600">{request.status}</span>
              </p>
              <div className="border-t mt-3 pt-3">
                <p className="text-gray-700">
                  <strong>Name:</strong> {request.name}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {request.phoneNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {request.email || 'N/A'}
                </p>
                <p className="text-gray-700">
                  <strong>Location:</strong> {request.location}
                </p>
                <p className="text-gray-700">
                  <strong>Reg. No.:</strong> {request.registrationNumber}
                </p>
                <p className="text-gray-700">
                  <strong>Year:</strong> {request.manufactureYear}
                </p>
                <p className="text-gray-700">
                  <strong>Condition:</strong>{' '}
                  <span className="capitalize">{request.condition}</span>
                </p>
                <p className="text-gray-700">
                  <strong>Car Type:</strong>{' '}
                  <span className="capitalize">{request.carType || 'N/A'}</span>
                </p>
                {request.kilometers && (
                  <p className="text-gray-700">
                    <strong>Kilometers:</strong> {request.kilometers}
                  </p>
                )}
                {request.preferredPickupDate && (
                  <p className="text-gray-700">
                    <strong>Pickup Date:</strong>{' '}
                    {moment(request.preferredPickupDate).format('DD-MM-YYYY')}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                  onClick={() => handleArchive(request._id, true)}
                >
                  Archive
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                  onClick={() => deleteScrapRequest(request._id)}
                >
                  Delete
                </button>
              </div>

              <select
                className="block w-full mt-3 border border-gray-300 bg-white text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  handleStatusChange(request._id, e.target.value)
                }
                value={request.status}
              >
                <option value="Created">Created</option>
                <option value="Contacted">Contacted</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          ))}
        </div>

        <div className="my-8">
          {showArchived ? (
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowArchived(false)}
            >
              Hide Archived
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => setShowArchived(true)}
            >
              Show Archived
            </button>
          )}
        </div>

        {showArchived && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedScrapRequests.map((request) => (
              <div
                key={request._id}
                className="border border-gray-300 bg-gray-50 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold">
                  {request.brand} {request.model} (Archived)
                </h2>
                <p className="text-gray-600 font-semibold mt-2">
                  Status:{' '}
                  <span className="text-blue-600">{request.status}</span>
                </p>
                <div className="border-t mt-3 pt-3">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {request.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {request.phoneNumber}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {request.email || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Location:</strong> {request.location}
                  </p>
                  <p className="text-gray-700">
                    <strong>Condition:</strong>{' '}
                    <span className="capitalize">{request.condition}</span>
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                    onClick={() => handleArchive(request._id, false)}
                  >
                    Unarchive
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                    onClick={() => deleteScrapRequest(request._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScrapRequestsPage
