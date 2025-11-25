import { useState, useEffect } from 'react'
import { healthAPI } from '../utils/api'
import { Activity, Server, Database, Shield, CheckCircle, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [health, setHealth] = useState({ 
    auth: null, 
    document: null, 
    redaction: null, 
    agent: null 
  })

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkHealth = async () => {
    const status = { 
      auth: false, 
      document: false, 
      redaction: false, 
      agent: false 
    }
    
    try {
      await healthAPI.auth()
      status.auth = true
    } catch {}
    
    try {
      await healthAPI.document()
      status.document = true
    } catch {}
    
    try {
      await healthAPI.redaction()
      status.redaction = true
    } catch {}
    
    try {
      await healthAPI.agent()
      status.agent = true
    } catch {}
    
    setHealth(status)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System monitoring and health checks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Auth Service</h2>
            </div>
            {health.auth ? (
              <CheckCircle className="h-6 w-6 text-accent-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            Status: <span className={`font-medium ${health.auth ? 'text-accent-600' : 'text-red-600'}`}>
              {health.auth ? 'Healthy' : 'Down'}
            </span>
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Document Service</h2>
            </div>
            {health.document ? (
              <CheckCircle className="h-6 w-6 text-accent-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            Status: <span className={`font-medium ${health.document ? 'text-accent-600' : 'text-red-600'}`}>
              {health.document ? 'Healthy' : 'Down'}
            </span>
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold">Redaction Service</h2>
            </div>
            {health.redaction ? (
              <CheckCircle className="h-6 w-6 text-accent-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            Status: <span className={`font-medium ${health.redaction ? 'text-accent-600' : 'text-red-600'}`}>
              {health.redaction ? 'Healthy' : 'Down'}
            </span>
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold">Agent Service</h2>
            </div>
            {health.agent ? (
              <CheckCircle className="h-6 w-6 text-accent-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <p className="text-sm text-gray-600">
            Status: <span className={`font-medium ${health.agent ? 'text-accent-600' : 'text-red-600'}`}>
              {health.agent ? 'Healthy' : 'Down'}
            </span>
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">System Information</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Platform</dt>
            <dd className="font-medium">Kubernetes</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Architecture</dt>
            <dd className="font-medium text-accent-600">Microservices</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Services</dt>
            <dd className="font-medium">Auth, Document, Redaction, Agent</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">API Gateway</dt>
            <dd className="font-medium">http://localhost:8080</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Health Check Interval</dt>
            <dd className="font-medium">10 seconds</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
