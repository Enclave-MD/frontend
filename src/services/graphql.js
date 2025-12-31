import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL endpoint - use /graphql which will be proxied by Vite dev server to localhost:8080
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

// Custom fetch with timeout support (90 seconds for AI operations)
const fetchWithTimeout = (url, options = {}) => {
  const timeout = 90000; // 90 seconds
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
};

// Create HTTP link with custom fetch that supports timeout
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  fetch: fetchWithTimeout,
});

// Create auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
      // Note: Timeout is handled by the backend (90 seconds)
      // The frontend will wait for the backend response
    },
  },
});

export default apolloClient;
