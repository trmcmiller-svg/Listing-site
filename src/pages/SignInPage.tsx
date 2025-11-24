import { Link } from "react-router-dom";

export const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome Back!
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600">
            Sign in to your Just Gorge account
          </p>
        </div>

        {/* User Type Cards for Sign In */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Patient Sign In Card */}
          <Link
            to="/patient-signin"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-2xl font-bold mb-3">I'm a Patient</h2>
            <p className="text-gray-600 mb-6">
              Access your appointments, favorites, and messages.
            </p>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Sign In as Patient</span>
              <span>→</span>
            </div>
          </Link>

          {/* Provider Sign In Card */}
          <Link
            to="/provider-signin"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-3">I'm a Provider</h2>
            <p className="text-gray-600 mb-6">
              Manage your profile, appointments, and patient inquiries.
            </p>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Sign In as Provider</span>
              <span>→</span>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
