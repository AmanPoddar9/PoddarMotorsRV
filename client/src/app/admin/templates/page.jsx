'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function TemplateListPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/templates`)
      const data = await res.json()
      if (res.ok) {
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return

    try {
      const res = await fetch(`${API_BASE_URL}/api/templates/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setTemplates(templates.filter(t => t._id !== id))
      } else {
        const error = await res.json()
        alert('Failed to delete: ' + error.message)
      }
    } catch (error) {
      alert('Error deleting template')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Inspection Templates</h1>
            <p className="text-gray-400 mt-2">Manage inspection structures and photo requirements</p>
          </div>
          <Link
            href="/admin/templates/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            + Create Template
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading templates...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-center">Default</th>
                  <th className="p-4 text-center">Created</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => (
                  <tr key={template._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="p-4 font-medium">{template.name}</td>
                    <td className="p-4 text-gray-400">{template.description || '-'}</td>
                    <td className="p-4 text-center">
                      {template.isDefault && (
                        <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs border border-green-800">
                          Active Default
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center text-gray-400 text-sm">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                       <Link
                        href={`/admin/templates/${template._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      {!template.isDefault && (
                        <button
                          onClick={() => handleDelete(template._id, template.name)}
                          className="text-red-400 hover:text-red-300 ml-4"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {templates.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No templates found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
