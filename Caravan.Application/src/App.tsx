import { AuthProvider, useAuth } from 'react-oidc-context';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './AppRouter.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_REALM_URL as string,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
  client_secret: import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET as string,
  redirect_uri: window.location.origin,
  post_logout_redirect_uri: window.location.origin, 
  response_type: import.meta.env.VITE_KEYCLOAK_AUTH_TYPE as string,
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider {...oidcConfig}>
        <AppWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function AppWithAuth() {
  const auth = useAuth();

  return (
    <RouterProvider router={router} context={{ auth }} />
  );
}

export default App
