# EnclaveMD Frontend

React web application for EnclaveMD.

## 🚀 Quick Start

### Prerequisites
- Docker
- Node.js 18+ (for local development)
- API Gateway running

### Running Locally

```bash
npm install
npm run dev
```

### Building for Production

```bash
docker build -t enclavemd-frontend .
docker run -p 3000:80 \
  -e VITE_API_URL=http://localhost:8080 \
  -e VITE_GRAPHQL_URL=http://localhost:8080/graphql \
  enclavemd-frontend
```

## 🔧 Configuration

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| VITE_API_URL | API Gateway URL | http://localhost:8080 |
| VITE_GRAPHQL_URL | GraphQL Gateway URL | http://localhost:8080/graphql |

## 🧪 Testing

```bash
npm test
```

## 📦 Docker Image

```bash
docker pull ghcr.io/enclavemd/frontend:latest
```

## 🤝 Contributing

See contributing guidelines in the main EnclaveMD repository.

## 📄 License

MIT License
