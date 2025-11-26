# EnclaveMD Frontend

Modern React frontend for EnclaveMD with user and admin interfaces.

## Features

- 🔐 **Authentication**: Login/Register with JWT
- 📄 **Document Management**: Upload, list, download, delete documents
- 🤖 **AI Query**: Natural language questions with privacy protection
- 🛡️ **PII Demo**: See privacy redaction in action
- 👨‍💼 **Admin Dashboard**: System monitoring and health checks
- 📱 **Responsive**: Works on desktop and mobile

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - API client
- **Lucide React** - Icons

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Docker

### Build Image

```bash
docker build -t enclavemd/frontend:latest .
```

### Run Container

```bash
docker run -p 3000:80 enclavemd/frontend:latest
```

## Kubernetes Deployment

### Build for Minikube

```bash
# Use Minikube's Docker
eval $(minikube docker-env)

# Build image
docker build -t enclavemd/frontend:latest .
```

### Deploy

```bash
# Deploy frontend
kubectl apply -f ../kubernetes/services/frontend-deployment.yaml

# Update ingress
kubectl apply -f ../kubernetes/ingress/ingress-with-frontend.yaml
```

### Access

```bash
# Add to /etc/hosts
echo "$(minikube ip) enclavemd.local" | sudo tee -a /etc/hosts

# Access at
open http://enclavemd.local
```

## Features

### User Dashboard
- View document statistics
- Quick actions
- Recent documents
- System health

### Document Management
- Drag & drop upload
- Real-time processing status
- Download documents
- Delete documents

### AI Query
- Natural language questions
- Privacy-protected queries
- Query history
- Example questions

### PII Demo
- See original text
- View redacted version
- Detected entities

### Admin Dashboard
- Service health monitoring
- System information

## API Integration

The frontend communicates with the backend through `/api` endpoints:

- `/api/auth/*` - Authentication
- `/api/documents/*` - Document management
- `/api/tee/*` - TEE operations

In development, Vite proxies API requests to `http://localhost:8080`.

In production (K8s), nginx proxies to the API gateway service.

## Environment Variables

- `VITE_API_URL` - API base URL (default: `/api`)

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── components/  # React components
│   │   └── Layout.jsx
│   ├── pages/       # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Query.jsx
│   │   ├── PIIDemo.jsx
│   │   └── AdminDashboard.jsx
│   ├── services/    # API services
│   │   └── api.js
│   ├── utils/       # Utilities
│   │   └── AuthContext.jsx
│   ├── App.jsx      # Main app
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── Dockerfile       # Docker build
├── nginx.conf       # Nginx configuration
└── vite.config.js   # Vite configuration
```

## Demo Credentials

- Email: `demo@enclavemd.com`
- Password: `demo123`

Or register a new account!
