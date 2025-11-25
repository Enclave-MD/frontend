import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Shield, Activity, TrendingUp, Clock } from 'lucide-react'
import { useDashboardData } from '../hooks/useGraphQL'

export default function Dashboard() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    console.error('GraphQL Error:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading dashboard data</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  // Extract data from GraphQL response
  const user = data?.me
  const documents = data?.documents || []
  const authHealth = data?.authHealth
  const documentHealth = data?.documentHealth
  const redactionHealth = data?.redactionHealth
  const agentHealth = data?.agentHealth

  // Calculate stats from documents
  const stats = {
    totalDocuments: documents.length,
    readyDocuments: documents.filter(d => d.status === 'ready').length,
    processingDocuments: documents.filter(d => d.status === 'processing').length,
  }

  // Get recent documents (first 5)
  const recentDocuments = documents.slice(0, 5)

  // Health status
  const health = {
    auth: authHealth?.status === 'healthy',
    document: documentHealth?.status === 'healthy',
    redaction: redactionHealth?.status === 'healthy',
    agent: agentHealth?.status === 'healthy',
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.fullName || user?.email || 'User'}! 
          Your secure medical document vault is ready.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalDocuments}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ready to Query</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.readyDocuments}</p>
            </div>
            <div className="bg-accent-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.processingDocuments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">AI Services</p>
              <p className="text-lg font-bold text-accent-600 mt-1">
                {health.agent ? 'Ready' : 'Checking...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Agent & Redaction
              </p>
            </div>
            <div className="bg-accent-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-accent-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/documents" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Upload Documents</h3>
              <p className="text-sm text-gray-600">Add new medical records</p>
            </div>
          </div>
        </Link>

        <Link to="/query" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <div className="bg-accent-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">Ask AI</h3>
              <p className="text-sm text-gray-600">Query your documents</p>
            </div>
          </div>
        </Link>

        <Link to="/pii-demo" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900">PII Demo</h3>
              <p className="text-sm text-gray-600">See privacy in action</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Documents */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
          <Link to="/documents" className="text-sm text-primary-600 hover:text-primary-700">
            View all →
          </Link>
        </div>

        {recentDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No documents yet</p>
            <Link to="/documents" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
              Upload your first document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.filename}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doc.status === 'ready' ? 'bg-accent-100 text-accent-700' :
                  doc.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Authentication Service</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              health.auth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.auth ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Document Service</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              health.document ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.document ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Redaction Service</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              health.redaction ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.redaction ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Agent Service</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              health.agent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {health.agent ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
