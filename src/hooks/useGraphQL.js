import { useQuery, useMutation } from '@apollo/client';
import { GET_DASHBOARD_DATA, GET_USER_PROFILE, GET_DOCUMENTS, GET_HEALTH_STATUS, GET_PII_DETECTION_TEST, INIT_DOCUMENT_UPLOAD, COMPLETE_DOCUMENT_UPLOAD, QUERY_DOCUMENTS, LOGIN_USER, REGISTER_USER } from '../services/graphqlQueries';

// Dashboard hook
export const useDashboardData = () => {
  return useQuery(GET_DASHBOARD_DATA);
};

// User profile hook
export const useUserProfile = () => {
  return useQuery(GET_USER_PROFILE);
};

// Documents hook
export const useDocuments = () => {
  return useQuery(GET_DOCUMENTS);
};


// Health status hook
export const useHealthStatus = () => {
  return useQuery(GET_HEALTH_STATUS);
};

// PII detection test hook
export const usePIIDetectionTest = () => {
  return useQuery(GET_PII_DETECTION_TEST);
};

// Document upload hooks
export const useInitDocumentUpload = () => {
  return useMutation(INIT_DOCUMENT_UPLOAD);
};

export const useCompleteDocumentUpload = () => {
  return useMutation(COMPLETE_DOCUMENT_UPLOAD);
};

// TEE query hook
export const useQueryDocuments = () => {
  return useMutation(QUERY_DOCUMENTS);
};

// Authentication hooks
export const useLoginUser = () => {
  return useMutation(LOGIN_USER);
};

export const useRegisterUser = () => {
  return useMutation(REGISTER_USER);
};
