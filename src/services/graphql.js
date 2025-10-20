import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL endpoint - use /graphql which will be proxied by Vite dev server to localhost:8080
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

// Create HTTP link
const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
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
  },
});

export default apolloClient;
