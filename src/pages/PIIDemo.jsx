import { useState } from 'react'
import { teeAPI } from '../utils/api'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function PIIDemo() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadDemo = async () => {
    setLoading(true)
    try {
      const response = await teeAPI.piiTest()
      setResult(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">PII Detection Demo</h1>
        <p className="text-gray-600 mt-1">See how we protect your privacy</p>
      </div>

      <div className="card">
        <button onClick={loadDemo} disabled={loading} className="btn-primary">
          {loading ? 'Loading...' : 'Run PII Detection Demo'}
        </button>
      </div>

      {result && (
        <>
          <div className="card">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-xl font-semibold">Original Text</h2>
            </div>
            <pre className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap">{result.original}</pre>
          </div>

          <div className="card bg-accent-50">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-accent-600 mr-2" />
              <h2 className="text-xl font-semibold text-accent-900">Redacted Text (Sent to AI)</h2>
            </div>
            <pre className="bg-white p-4 rounded text-sm whitespace-pre-wrap border-2 border-accent-200">{result.redacted}</pre>
            <div className="mt-4 text-sm text-accent-700">
              ✓ {result.entities?.length || 0} PII entities detected and redacted
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Detected PII</h2>
            <div className="space-y-2">
              {result.entities?.map((entity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="font-medium">{entity.type}</span>
                  <span className="text-gray-600">{entity.text}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
