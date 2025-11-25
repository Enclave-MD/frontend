import { gql } from '@apollo/client';

// Dashboard query - gets all data needed for the dashboard in one request
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    me {
      id
      email
      fullName
      createdAt
    }
    documents {
      id
      filename
      fileSize
      mimeType
      status
      createdAt
      updatedAt
      downloadUrl
      metadata {
        id
        anonymizedSummary
        piiCount
        textLength
      }
    }
    authHealth {
      status
      service
    }
    documentHealth {
      status
      service
    }
    redactionHealth {
      status
      service
    }
    agentHealth {
      status
      service
    }
  }
`;

// User profile query
export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      fullName
      createdAt
    }
  }
`;

// Documents query
export const GET_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      id
      filename
      fileSize
      mimeType
      status
      createdAt
      updatedAt
      downloadUrl
      metadata {
        id
        anonymizedSummary
        piiCount
        textLength
      }
    }
  }
`;

// PII detection test query (moved from TEE to redaction service)
export const GET_PII_DETECTION_TEST = gql`
  query GetPIIDetectionTest {
    piiDetectionTest {
      original
      redacted
      entities {
        type
        text
        start
        end
      }
      mapping
    }
  }
`;

// Health checks query
export const GET_HEALTH_STATUS = gql`
  query GetHealthStatus {
    authHealth {
      status
      service
    }
    documentHealth {
      status
      service
    }
    redactionHealth {
      status
      service
    }
    agentHealth {
      status
      service
    }
  }
`;


// Document upload mutations
export const INIT_DOCUMENT_UPLOAD = gql`
  mutation InitDocumentUpload($input: InitUploadInput!) {
    initUpload(input: $input) {
      documentId
      uploadUrl
      storageKey
    }
  }
`;

export const COMPLETE_DOCUMENT_UPLOAD = gql`
  mutation CompleteDocumentUpload($input: CompleteUploadInput!) {
    completeUpload(input: $input) {
      id
      filename
      status
      createdAt
    }
  }
`;

// TEE query mutation
export const QUERY_DOCUMENTS = gql`
  mutation QueryDocuments($input: QueryInput!) {
    queryDocuments(input: $input) {
      answer
      sourcesCount
      redactedQuery
    }
  }
`;

// Authentication mutations
export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        fullName
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        fullName
      }
    }
  }
`;
