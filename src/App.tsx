import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HomePage } from "@/pages/HomePage";
import { JoinPage } from "@/pages/JoinPage";
import { SignInPage } from "@/pages/SignInPage";
import { PatientSignInPage } from "@/pages/PatientSignInPage";
import { ProviderSignInPage } from "@/pages/ProviderSignInPage";
import { SearchPage } from "@/pages/SearchPage";
import { ProviderProfilePage } from "@/pages/ProviderProfilePage";
import { ProviderSignupPage } from "@/pages/ProviderSignupPage";
import { PatientSignupPage } from "@/pages/PatientSignupPage";
import { PatientDashboardPage } from "@/pages/PatientDashboardPage";
import { ProviderDashboardPage } from "@/pages/ProviderDashboardPage";
import { MessagingPageNew } from "@/pages/MessagingPageNew";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostPage } from "@/pages/BlogPostPage";

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-sm">
                JG
              </div>
              <span className="text-lg font-medium">Just Gorge</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/blog" className="text-sm hover:text-gray-600">
                Blog
              </Link>
              <Link to="/admin-dashboard" className="text-sm hover:text-gray-600">
                Admin
              </Link>
              <button className="text-sm hover:text-gray-600">
                👤
              </button>
              <Link
                to="/signin"
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/patient-signin" element={<PatientSignInPage />} />
          <Route path="/provider-signin" element={<ProviderSignInPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/provider/:id" element={<ProviderProfilePage />} />
          <Route path="/provider-signup" element={<ProviderSignupPage />} />
          <Route path="/patient-signup" element={<PatientSignupPage />} />
          <Route path="/patient-dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/provider-dashboard" element={
            <ProtectedRoute requiredRole="provider">
              <ProviderDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagingPageNew />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-950 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-sm text-black">
                    JG
                  </div>
                  <span className="text-lg font-medium text-white">Just Gorge</span>
                </div>
                <p className="text-xl font-light leading-relaxed mb-6">
                  Book verified aesthetic providers & get expert care
                </p>
                <Link
                  to="/provider-signup"
                  className="inline-block border border-gray-600 px-8 py-2 rounded text-sm hover:border-gray-400 transition-colors"
                >
                  Become a Provider
                </Link>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                  <li><a href="#" className="hover:text-white">FAQ</a></li>
                  <li><a href="#" className="hover:text-white">Providers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Support</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Give feedback</a></li>
                  <li><a href="#" className="hover:text-white">Suggest a provider</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-4 text-sm">Follow us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                    <span className="text-xs">𝕏</span>
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                    <span className="text-xs">in</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6 flex items-center justify-between text-xs">
              <p>© Just Gorge 2025. All rights reserved</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white">Policy</a>
                <a href="#" className="hover:text-white">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};
