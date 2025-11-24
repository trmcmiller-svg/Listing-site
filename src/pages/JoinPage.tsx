import { Link } from "react-router-dom";

export const JoinPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Begin Your Gorge Journey
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600">
            Select Your Path
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Patient Card */}
          <Link
            to="/patient-signup"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-3">I'm a Patient</h2>
            <p className="text-gray-600 mb-6">
              Find verified aesthetic providers, read reviews, and book treatments with confidence
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Search verified providers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Read real patient reviews</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Compare prices & treatments</span>
              </div>
            </div>
            <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Sign Up as Patient</span>
              <span>→</span>
            </div>
          </Link>

          {/* Provider Card */}
          <Link
            to="/provider-signup"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-2xl font-bold mb-3">I'm a Provider</h2>
            <p className="text-gray-600 mb-6">
              Join our platform to connect with patients actively searching for your services
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Get verified & build trust</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Reach qualified patients</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                <span>Showcase your work</span>
              </div>
            </div>
            <div className="flex items-center text-purple-600 font-semibold group-hover:gap-3 gap-2 transition-all">
              <span>Sign Up as Provider</span>
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
