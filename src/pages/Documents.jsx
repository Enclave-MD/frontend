import { useState, useEffect } from 'react'
import { documentAPI } from '../utils/api'
import { useDocuments } from '../hooks/useGraphQL'
import { Upload, FileText, Download, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import axios from 'axios'

export default function Documents() {
  const { data, loading: gqlLoading, error: gqlError, refetch } = useDocuments()
  const documents = data?.documents || []
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Initial load and periodic refresh
    refetch()
    const interval = setInterval(refetch, 5000)
    return () => clearInterval(interval)
  }, [])

  // Keep a local error banner in addition to GraphQL error
  useEffect(() => {
    if (gqlError) {
      console.error('GraphQL error loading documents:', gqlError)
      setError(gqlError.message || 'Failed to load documents')
    }
  }, [gqlError])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')

    try {
      // Use direct upload endpoint - simpler and no CORS issues
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('auth_token')
      const response = await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      })

      setSuccess(`${file.name} uploaded successfully! Processing started...`)
      refetch()
      
      // Clear file input
      e.target.value = ''
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.response?.data?.detail || error.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (doc) => {
    try {
      const token = localStorage.getItem('auth_token')
      const downloadUrl = `/api/documents/${doc.id}/download`
      
      // Fetch the file from the download endpoint
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Download failed')
      }
      
      // Get the blob and create a download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      setError('Download failed')
    }
  }

  const handleDelete = async (doc) => {
    if (!confirm(`Delete "${doc.filename}"?`)) return

    try {
      await documentAPI.delete(doc.id)
      setSuccess('Document deleted')
      refetch()
    } catch (error) {
      setError('Delete failed')
    }
  }

  if (gqlLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-1">Manage your medical documents</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-accent-50 border border-accent-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-accent-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent-700">{success}</p>
        </div>
      )}

      {/* Upload Card */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
            accept=".pdf,.txt,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-sm text-gray-600">Uploading and processing in TEE...</p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600">
                  PDF, TXT, DOC up to 10MB
                </p>
              </>
            )}
          </label>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-1">🔒 Privacy Protected</p>
          <p className="text-xs text-blue-700">
            All documents are processed in a Trusted Execution Environment (TEE) where PII is automatically redacted before AI processing.
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Documents ({documents.length})
          </h2>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No documents yet</p>
            <p className="text-sm text-gray-500">Upload your first medical document to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center flex-1">
                  <FileText className="h-8 w-8 text-gray-400 mr-4" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.filename}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        doc.status === 'ready' ? 'bg-accent-100 text-accent-700' :
                        doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        doc.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.status === 'ready' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                        {doc.status === 'processing' && <Clock className="h-3 w-3 inline mr-1 animate-spin" />}
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
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
