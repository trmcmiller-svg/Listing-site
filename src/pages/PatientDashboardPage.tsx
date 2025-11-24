import { useState } from "react";
import { Link } from "react-router-dom";

export const PatientDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "favorites" | "reviews" | "messages" | "profile">("appointments");

  return (
    <div className="min-h-screen bg-[#E8E8E4]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, Jane!</h1>
                <p className="text-gray-600">jane.smith@example.com</p>
              </div>
            </div>
            <Link
              to="/search"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find Providers
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <p className="text-gray-600">Upcoming Appointments</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
            <p className="text-gray-600">Favorite Providers</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">8</div>
            <p className="text-gray-600">Reviews Written</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">$50</div>
            <p className="text-gray-600">Available Credit</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: "appointments", label: "Appointments" },
                { id: "favorites", label: "Favorites" },
                { id: "reviews", label: "My Reviews" },
                { id: "messages", label: "Messages" },
                { id: "profile", label: "Profile Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === "appointments" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Appointments</h2>
                  <Link
                    to="/search"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Book New Appointment
                  </Link>
                </div>

                {/* Upcoming Appointments */}
                <div className="space-y-4">
                  {[
                    {
                      provider: "Dr. Sarah Johnson",
                      treatment: "Botox Consultation",
                      date: "March 15, 2025",
                      time: "2:00 PM",
                      location: "Beverly Hills, CA",
                      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
                    },
                    {
                      provider: "Jessica Martinez, NP",
                      treatment: "Dermal Fillers",
                      date: "March 22, 2025",
                      time: "10:30 AM",
                      location: "Los Angeles, CA",
                      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
                    },
                    {
                      provider: "Emily Chen",
                      treatment: "Facial Treatment",
                      date: "April 5, 2025",
                      time: "3:00 PM",
                      location: "Santa Monica, CA",
                      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
                    },
                  ].map((appointment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <img
                          src={appointment.image}
                          alt={appointment.provider}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{appointment.provider}</h3>
                          <p className="text-gray-600 mb-2">{appointment.treatment}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>📅 {appointment.date}</span>
                            <span>🕐 {appointment.time}</span>
                            <span>📍 {appointment.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                            View Details
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Past Appointments */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Past Appointments</h3>
                  <div className="space-y-3">
                    {[
                      {
                        provider: "Dr. Michael Torres",
                        treatment: "Laser Hair Removal",
                        date: "February 10, 2025",
                      },
                      {
                        provider: "Lisa Thompson",
                        treatment: "Chemical Peel",
                        date: "January 15, 2025",
                      },
                    ].map((appointment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{appointment.provider}</h4>
                            <p className="text-sm text-gray-600">{appointment.treatment} • {appointment.date}</p>
                          </div>
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50">
                            Write Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Your Favorite Providers</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Dr. Sarah Johnson",
                      specialty: "Dermatology",
                      rating: 4.9,
                      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
                    },
                    {
                      name: "Jessica Martinez, NP",
                      specialty: "Injectable Aesthetics",
                      rating: 4.8,
                      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
                    },
                    {
                      name: "Emily Chen",
                      specialty: "Advanced Skincare",
                      rating: 4.9,
                      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop",
                    },
                  ].map((provider, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold mb-1">{provider.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold">{provider.rating}</span>
                          </div>
                          <button className="text-red-500 hover:text-red-700">
                            ♥ Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Your Reviews</h2>
                <div className="space-y-4">
                  {[
                    {
                      provider: "Dr. Sarah Johnson",
                      treatment: "Botox",
                      rating: 5,
                      date: "March 1, 2025",
                      review: "Amazing experience! Dr. Johnson was professional and the results are exactly what I wanted.",
                    },
                    {
                      provider: "Emily Chen",
                      treatment: "Facial",
                      rating: 5,
                      date: "February 15, 2025",
                      review: "Best facial I've ever had. Emily is so knowledgeable and my skin looks incredible!",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold">{review.provider}</h3>
                          <p className="text-sm text-gray-600">{review.treatment} • {review.date}</p>
                        </div>
                        <div className="flex text-yellow-500">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button className="text-sm text-red-600 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Your Messages</h2>
                  <Link
                    to="/messages"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View All Messages
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      provider: "Dr. Sarah Johnson",
                      lastMessage: "I'd be happy to schedule a consultation with you.",
                      time: "1h ago",
                      unread: 2,
                      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
                    },
                    {
                      provider: "Jessica Martinez, NP",
                      lastMessage: "Thank you for your interest in our services.",
                      time: "1d ago",
                      unread: 0,
                      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
                    },
                  ].map((msg, index) => (
                    <Link
                      key={index}
                      to="/messages"
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={msg.image}
                          alt={msg.provider}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {msg.unread > 0 && (
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {msg.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1">{msg.provider}</h4>
                        <p className="text-sm text-gray-600 truncate">{msg.lastMessage}</p>
                      </div>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Change Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="Jane"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Smith"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="jane.smith@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">ZIP Code</label>
                    <input
                      type="text"
                      defaultValue="90210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-bold mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>Email notifications for appointments</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span>SMS reminders</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>Marketing emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                      Save Changes
                    </button>
                    <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
