# EnclaveMD Frontend - Documentation

## Purpose

The Frontend provides a modern, responsive web interface for EnclaveMD, enabling users to securely manage medical documents, query them with AI, and visualize privacy protection in action.

## Role in System

User-facing application layer:
- Provides authentication UI (login/register)
- Enables document upload with drag-and-drop
- Displays document management dashboard
- Offers natural language query interface for AI-powered document search
- Shows admin monitoring dashboard
- Demonstrates PII redaction capabilities
- Communicates with backend via REST API and GraphQL

## Why We Need It

Users need an intuitive interface to:
1. Upload and manage their medical documents
2. Ask questions about their documents in natural language
3. See their data is being protected (PII redaction demo)
4. Monitor document processing status
5. Access their data from any device (responsive design)

## Technical Implementation

**Technology Stack:**
- **Framework**: React 18 with Hooks
- **Build Tool**: Vite (fast development and production builds)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (utility-first)
- **HTTP Client**: Axios
- **GraphQL Client**: Apollo Client
- **Icons**: Lucide React
- **State Management**: React Context API (AuthContext)

**Key Features:**

1. **Authentication:**
   - JWT token-based auth
   - Token stored in localStorage
   - AuthContext provides global user state
   - Protected routes redirect to login
   - Auto token refresh

2. **Document Management:**
   - Drag-and-drop file upload
   - Direct upload to MinIO via presigned URLs
   - Real-time status updates (uploading → processing → ready)
   - Document list with metadata
   - Download and delete capabilities

3. **AI Query Interface:**
   - Natural language question input
   - Query history
   - Example questions for guidance
   - Source document references
   - Shows redacted query for transparency

4. **PII Demo Page:**
   - Side-by-side view: original vs. redacted
   - Highlights detected PII entities
   - Interactive demonstration of privacy protection
   - Educational for users

5. **Admin Dashboard:**
   - Service health monitoring
   - System statistics
   - Service status indicators
   - Links to Grafana/Prometheus

## Code Structure

```
src/
├── App.jsx                    # Main app component, routing setup
├── main.jsx                   # Entry point
├── index.css                  # Global styles (Tailwind imports)
├── components/
│   └── Layout.jsx            # Navigation sidebar, page layout wrapper
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Dashboard.jsx         # User dashboard (stats, quick actions)
│   ├── Documents.jsx         # Document management page
│   ├── Query.jsx             # AI query interface
│   ├── PIIDemo.jsx           # PII redaction demonstration
│   └── AdminDashboard.jsx    # Admin monitoring page
├── services/
│   ├── api.js                # REST API client (Axios)
│   ├── graphql.js            # Apollo Client setup
│   └── graphqlQueries.js     # GraphQL query definitions
└── utils/
    └── AuthContext.jsx        # Authentication context provider
```

## API Integration

**REST API Endpoints (via Axios):**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `GET /api/documents` - List documents
- `POST /api/documents/init-upload` - Get upload URL
- `POST /api/documents/complete` - Complete upload
- `DELETE /api/documents/{id}` - Delete document
- `POST /api/agent/query` - AI query

**GraphQL API (via Apollo Client):**
- `query GetDocuments` - Fetch documents with metadata
- `query GetDocumentDetails` - Single document details
- `query QueryDocuments` - AI-powered query
- (Future: subscriptions for real-time updates)

**API Base URL:**
- Development: `http://localhost:8080` (proxied by Vite)
- Production: `/api` (relative, served by API Gateway)

## Pages Overview

### 1. Login / Register
- Simple forms with validation
- JWT token received on success
- Redirects to dashboard

### 2. Dashboard
- Quick stats (document count, recent uploads)
- Quick action buttons
- Recent document list
- System health indicators

### 3. Documents
- Upload zone (drag-and-drop or click)
- Document list with status badges
- Search and filter
- Download and delete actions
- Processing status indicators

### 4. Query
- Text input for natural language questions
- Example questions for new users
- Query history
- Results with source documents
- Shows redacted version of query

### 5. PII Demo
- Upload or paste sample text
- Shows original and redacted side-by-side
- Highlights detected entities with colors
- Explains what PII was found

### 6. Admin Dashboard
- Service health checks
- Prometheus metrics visualization
- Links to Grafana dashboards
- System information

## Deployment

**Development:**
```bash
npm install
npm run dev  # Vite dev server on port 3000
```

**Production (Docker):**
- Built with Vite: `npm run build`
- Served by NGINX
- Environment variables injected at build time
- Static assets optimized

**NGINX Configuration:**
- Serves static files from `/usr/share/nginx/html`
- Proxies `/api/*` to API Gateway
- Handles React Router (SPA routing)

## Responsive Design

- Mobile-first approach
- Tailwind breakpoints (sm, md, lg, xl)
- Sidebar collapses on mobile
- Touch-friendly UI elements
- Optimized for tablets and phones
