import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components with error boundaries
const lazyLoad = (importFunc) => {
  return React.lazy(() => importFunc().catch(error => {
    console.error('Error loading component:', error);
    return { default: () => <div>Error loading component. Please try again later.</div> };
  }));
};

// Lazy load components
const QuizContainer = lazyLoad(() => import('./components/QuizContainer'));
const Result = lazyLoad(() => import('./components/Result'));
const Login = lazyLoad(() => import('./components/auth/Login'));
const Signup = lazyLoad(() => import('./components/auth/Signup'));
const Home = lazyLoad(() => import('./components/Home'));
const Profile = lazyLoad(() => import('./components/Profile'));
const Settings = lazyLoad(() => import('./components/Settings'));
const QuizCategories = lazyLoad(() => import('./components/QuizCategories'));
const FAQ = lazyLoad(() => import('./components/FAQ'));
const PrivacyPolicy = lazyLoad(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazyLoad(() => import('./components/TermsOfService'));
const Scoreboard = lazyLoad(() => import('./components/Scoreboard'));
const CookieSettings = lazyLoad(() => import('./components/CookieSettings'));
const About = lazyLoad(() => import('./components/About'));
const Contact = lazyLoad(() => import('./components/Contact'));
const QuizDashboard = lazyLoad(() => import('./components/QuizDashboard'));
const HelpCenter = lazyLoad(() => import('./components/HelpCenter'));
const History = lazyLoad(() => import('./components/History'));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Route configurations
const ROUTES = {
  PUBLIC: [
    { path: '/login', element: Login },
    { path: '/signup', element: Signup },
  ],
  PROTECTED: [
    { path: '/', element: Home },
    { path: '/home', element: Home },
    { path: '/quiz', element: QuizContainer },
    { path: '/results', element: Result },
    { path: '/profile', element: Profile },
    { path: '/settings', element: Settings },
    { path: '/quiz-categories', element: QuizCategories },
    { path: '/faq', element: FAQ },
    { path: '/privacy-policy', element: PrivacyPolicy },
    { path: '/terms-of-service', element: TermsOfService },
    { path: '/scoreboard', element: Scoreboard },
    { path: '/cookie-settings', element: CookieSettings },
    { path: '/quiz-dashboard', element: QuizDashboard },
    { path: '/contact', element: Contact },
    { path: '/about', element: About },
    { path: '/help', element: HelpCenter },
    { path: '/history', element: History },
  ],
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <LoadingProvider>
              <ToastProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <ReactRoutes>
                    {/* Public Routes */}
                    {ROUTES.PUBLIC.map(({ path, element: Element }) => (
                      <Route key={path} path={path} element={<Element />} />
                    ))}
                    
                    {/* Protected Routes */}
                    {ROUTES.PROTECTED.map(({ path, element: Element }) => (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <ProtectedRoute>
                            <Element />
                          </ProtectedRoute>
                        }
                      />
                    ))}
                  </ReactRoutes>
                </Suspense>
              </ToastProvider>
            </LoadingProvider>
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}


export default App;