import { useState, useEffect } from 'react'
import { useDocuments, useQueryDocuments } from '../hooks/useGraphQL'
import { MessageSquare, Send, Shield, Clock, FileText, AlertCircle } from 'lucide-react'

export default function Query() {
  const { data: documentsData, loading: documentsLoading, error: documentsError, refetch: refetchDocuments } = useDocuments()
  const [queryDocuments] = useQueryDocuments()
  
  const documents = documentsData?.documents?.filter(d => d.status === 'ready') || []
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (documentsError) {
      console.error('Error loading documents:', documentsError)
      setError('Failed to load documents')
    }
  }, [documentsError])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setError('')
    setAnswer(null)

    try {
      const result = await queryDocuments({
        variables: {
          input: {
            question: question
          }
        }
      })
      
      const queryResult = result.data?.queryDocuments
      if (queryResult) {
        setAnswer(queryResult)
        setHistory([{ question, answer: queryResult, timestamp: new Date() }, ...history])
        setQuestion('')
      } else {
        setError('Query failed. Please try again.')
      }
    } catch (error) {
      console.error('Query error:', error)
      setError(error.message || 'Query failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exampleQuestions = [
    "What medication am I currently taking?",
    "When does my insurance expire?",
    "What were my latest lab results?",
    "Summarize my medical conditions",
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Query</h1>
        <p className="text-gray-600 mt-1">Ask questions about your medical documents</p>
      </div>

      {/* Privacy Notice */}
      <div className="card bg-accent-50 border-2 border-accent-200">
        <div className="flex items-start">
          <Shield className="h-6 w-6 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-accent-900 mb-1">Privacy Protected</h3>
            <p className="text-sm text-accent-700">
              All PII is automatically redacted before being sent to AI. OpenAI never sees your real personal information.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Document Count */}
      <div className="card bg-blue-50">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{documents.length}</span> documents available for querying
          </p>
        </div>
      </div>

      {/* Query Form */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input min-h-[100px] resize-none"
              placeholder="Ask anything about your medical documents..."
              disabled={loading || documents.length === 0}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {documentsLoading ? (
                <span>Loading documents...</span>
              ) : documents.length === 0 ? (
                <span className="text-yellow-600">Upload documents first to start querying</span>
              ) : (
                `Querying ${documents.length} document(s)`
              )}
            </p>
            <button
              type="submit"
              disabled={loading || !question.trim() || documents.length === 0 || documentsLoading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Ask AI
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example Questions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Try asking:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="text-left px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading || documents.length === 0 || documentsLoading}
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer */}
      {answer && (
        <div className="card bg-accent-50 border-2 border-accent-200">
          <div className="flex items-start mb-3">
            <MessageSquare className="h-6 w-6 text-accent-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Answer</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{answer.answer}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-accent-200 text-xs text-accent-700">
            <span>Sources: {answer.sourcesCount} document(s)</span>
            <span>Redacted query: "{answer.redactedQuery}"</span>
          </div>
        </div>
      )}

      {/* Query History */}
      {history.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Queries</h2>
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start mb-2">
                  <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0 mt-1" />
                  <p className="font-medium text-gray-900">{item.question}</p>
                </div>
                <p className="text-sm text-gray-600 ml-6">{item.answer.answer}</p>
                <p className="text-xs text-gray-500 ml-6 mt-2">
                  {item.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
