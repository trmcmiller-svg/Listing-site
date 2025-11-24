import { useState } from "react";
import { Link } from "react-router-dom";

export const ProviderDashboardPage = () => {
  const [activeSection, setActiveSection] = useState<"overview" | "appointments" | "messages" | "reviews" | "analytics" | "blog" | "profile">("overview");
  const [providerPlan, setProviderPlan] = useState<"free" | "pro" | "premium">("premium"); // Mock provider's current plan

  const navItems = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "appointments", label: "Appointments", icon: "📅" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "blog", label: "Blog", icon: "✍️" }, // New Blog item
    { id: "profile", label: "Profile Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#E8E8E4]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">Dr. Sarah Johnson</h1>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                    ✓ Verified
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    providerPlan === "premium" ? "bg-purple-100 text-purple-800" :
                    providerPlan === "pro" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {providerPlan === "premium" ? "Premium Plan" :
                     providerPlan === "pro" ? "Pro Plan" : "Free Plan"}
                  </span>
                </div>
              </div>
            </div>
            <Link
              to="/provider/1"
              className="border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Public Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">234</div>
            <p className="text-gray-600 text-sm">Profile Views</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% this week</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">18</div>
            <p className="text-gray-600 text-sm">New Inquiries</p>
            <p className="text-xs text-green-600 mt-1">↑ 5 today</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-green-600 mb-1">4.9</div>
            <p className="text-gray-600 text-sm">Average Rating</p>
            <p className="text-xs text-gray-500 mt-1">234 reviews</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">12</div>
            <p className="text-gray-600 text-sm">Appointments</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-3xl font-bold text-pink-600 mb-1">89%</div>
            <p className="text-gray-600 text-sm">Response Rate</p>
            <p className="text-xs text-green-600 mt-1">Excellent</p>
          </div>
        </div>

        {/* Main Content Area with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 bg-white rounded-xl shadow-md p-4 h-fit sticky top-8">
            <h3 className="text-lg font-bold mb-4">Dashboard Menu</h3>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-left font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-800"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-md p-6">
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {[
                      { type: "inquiry", text: "New consultation request from Jennifer M.", time: "2 hours ago" },
                      { type: "review", text: "New 5-star review from Sarah K.", time: "5 hours ago" },
                      { type: "booking", text: "Appointment booked for March 15", time: "1 day ago" },
                      { type: "view", text: "Your profile was viewed 45 times", time: "1 day ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "inquiry" ? "bg-blue-500" :
                          activity.type === "review" ? "bg-green-500" :
                          activity.type === "booking" ? "bg-purple-500" :
                          "bg-gray-500"
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.text}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                      <div className="text-2xl mb-2">📅</div>
                      <h3 className="font-bold mb-1">Manage Calendar</h3>
                      <p className="text-sm text-gray-600">Set availability and block dates</p>
                    </button>
                    <Link
                      to="/messages"
                      className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl">💬</div>
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                      </div>
                      <h3 className="font-bold mb-1">Messages</h3>
                      <p className="text-sm text-gray-600">3 unread messages</p>
                    </Link>
                    <button className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left">
                      <div className="text-2xl mb-2">📸</div>
                      <h3 className="font-bold mb-1">Upload Photos</h3>
                      <p className="text-sm text-gray-600">Add before/after images</p>
                    </button>
                  </div>
                </div>

                {/* Upgrade Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                  <p className="mb-4">Get featured placement, advanced analytics, and unlimited photos</p>
                  <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                    Learn More
                  </button>
                </div>
              </div>
            )}

            {activeSection === "appointments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Appointments</h2>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Block Time Off
                  </button>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <h3 className="font-bold mb-4">Upcoming (12)</h3>
                  <div className="space-y-3">
                    {[
                      {
                        patient: "Jennifer M.",
                        treatment: "Botox Consultation",
                        date: "March 15, 2025",
                        time: "2:00 PM",
                        status: "confirmed",
                      },
                      {
                        patient: "Sarah K.",
                        treatment: "Dermal Fillers",
                        date: "March 15, 2025",
                        time: "3:30 PM",
                        status: "confirmed",
                      },
                      {
                        patient: "Michael R.",
                        treatment: "Laser Treatment",
                        date: "March 16, 2025",
                        time: "10:00 AM",
                        status: "pending",
                      },
                    ].map((appointment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{appointment.patient}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                appointment.status === "confirmed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{appointment.treatment}</p>
                            <p className="text-sm text-gray-500">📅 {appointment.date} • 🕐 {appointment.time}</p>
                          </div>
                          <div className="flex gap-2">
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
                </div>

                {/* Calendar View */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Calendar View</h3>
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
                    Calendar Component Placeholder
                  </div>
                </div>
              </div>
            )}

            {activeSection === "messages" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Your Messages</h2>
                <p className="text-gray-600 mb-4">
                  Access your full messaging inbox to communicate with patients.
                </p>
                <Link
                  to="/messages"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Messages
                </Link>
              </div>
            )}

            {activeSection === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Reviews & Ratings</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-bold">4.9</span>
                        <div className="flex text-yellow-500 text-xl">★★★★★</div>
                      </div>
                      <span className="text-gray-600">234 reviews</span>
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { stars: 5, count: 210, percentage: 90 },
                      { stars: 4, count: 20, percentage: 8 },
                      { stars: 3, count: 3, percentage: 1 },
                      { stars: 2, count: 1, percentage: 0.5 },
                      { stars: 1, count: 0, percentage: 0.5 },
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        <span className="text-sm w-12">{rating.stars} stars</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${rating.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">{rating.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div className="space-y-4">
                  {[
                    {
                      patient: "Jennifer M.",
                      rating: 5,
                      date: "March 1, 2025",
                      review: "Dr. Johnson is amazing! Professional, knowledgeable, and the results are perfect.",
                      treatment: "Botox",
                    },
                    {
                      patient: "Sarah K.",
                      rating: 5,
                      date: "February 28, 2025",
                      review: "Best experience ever. Highly recommend!",
                      treatment: "Dermal Fillers",
                    },
                  ].map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold">{review.patient}</h4>
                          <p className="text-sm text-gray-500">{review.treatment} • {review.date}</p>
                        </div>
                        <div className="flex text-yellow-500">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{review.review}</p>
                      <button className="text-sm text-blue-600 hover:underline">
                        Reply to Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Analytics & Insights</h2>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Profile Views</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-1">1,234</div>
                    <p className="text-sm text-green-600">↑ 23% vs last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Conversion Rate</h3>
                    <div className="text-3xl font-bold text-purple-600 mb-1">12.5%</div>
                    <p className="text-sm text-green-600">↑ 3% vs last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Avg Response Time</h3>
                    <div className="text-3xl font-bold text-green-600 mb-1">2.3h</div>
                    <p className="text-sm text-green-600">↓ 0.5h vs last month</p>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Profile Views Over Time</h3>
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
                    Chart Component Placeholder
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-4">Popular Treatments</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Botox", bookings: 45, percentage: 35 },
                      { name: "Dermal Fillers", bookings: 38, percentage: 30 },
                      { name: "Laser Treatments", bookings: 25, percentage: 20 },
                      { name: "Chemical Peels", bookings: 19, percentage: 15 },
                    ].map((treatment) => (
                      <div key={treatment.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{treatment.name}</span>
                          <span className="text-sm text-gray-600">{treatment.bookings} bookings</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${treatment.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "profile" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Profile Customization</h2>
                  <Link
                    to="/provider/1"
                    className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
                  >
                    Preview Profile →
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Left Column - Main Settings */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Profile Header Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">Profile Header</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Profile Photo</label>
                          <div className="flex items-center gap-4">
                            <img
                              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                            />
                            <div className="flex flex-col gap-2">
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                                Upload New Photo
                              </button>
                              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                Remove Photo
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Recommended: Square image, at least 400x400px</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Cover Photo (Optional)</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                            <div className="text-4xl mb-2">🖼️</div>
                            <p className="text-gray-600 mb-2">Add a cover photo to make your profile stand out</p>
                            <p className="text-sm text-gray-500">1200x400px recommended</p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Full Name</label>
                          <input
                            type="text"
                            defaultValue="Dr. Sarah Johnson"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Professional Title</label>
                          <input
                            type="text"
                            defaultValue="Board-Certified Dermatologist"
                            placeholder="e.g., Board-Certified Plastic Surgeon"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Tagline</label>
                          <input
                            type="text"
                            defaultValue="Natural Results, Expert Care"
                            placeholder="A short, memorable phrase about your practice"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Max 60 characters</p>
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">About You</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Bio</label>
                          <textarea
                            rows={6}
                            defaultValue="Board-certified dermatologist with over 15 years of experience in medical and aesthetic dermatology. I specialize in non-surgical facial rejuvenation and am passionate about helping patients achieve natural-looking results."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          ></textarea>
                          <p className="text-xs text-gray-500 mt-1">Tell patients about your experience and approach</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Years of Experience</label>
                          <input
                            type="number"
                            defaultValue="15"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Languages Spoken</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {["English", "Spanish"].map((lang) => (
                              <span key={lang} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {lang}
                                <button className="hover:text-blue-900">×</button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Add another language"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Education & Credentials */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Education & Credentials</h3>
                        <button className="text-blue-600 font-semibold hover:underline text-sm">
                          + Add More
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { degree: "Medical Degree (MD)", school: "UCLA School of Medicine", year: "2008" },
                          { degree: "Dermatology Residency", school: "Stanford University", year: "2012" },
                        ].map((edu, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  defaultValue={edu.degree}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Degree/Certification"
                                />
                                <input
                                  type="text"
                                  defaultValue={edu.school}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Institution"
                                />
                                <input
                                  type="text"
                                  defaultValue={edu.year}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Year"
                                />
                              </div>
                              <button className="ml-3 text-red-600 hover:text-red-700">
                                <span className="text-xl">×</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatments & Pricing */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Treatments & Pricing</h3>
                        <button className="text-blue-600 font-semibold hover:underline text-sm">
                          + Add Treatment
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { name: "Botox & Dysport", price: "$12-15/unit", duration: "30 min" },
                          { name: "Dermal Fillers", price: "$600-800/syringe", duration: "45 min" },
                          { name: "Laser Resurfacing", price: "$800-1,200", duration: "60 min" },
                        ].map((treatment, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <input
                                type="text"
                                defaultValue={treatment.name}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Treatment name"
                              />
                              <button className="text-red-600 hover:text-red-700">
                                <span className="text-xl">×</span>
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                defaultValue={treatment.price}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Price range"
                              />
                              <input
                                type="text"
                                defaultValue={treatment.duration}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Duration"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Office Photos */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Office Photos</h3>
                        <button className="text-blue-600 font-semibold hover:underline text-sm">
                          + Upload Photos
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                            <img
                              src={`https://images.unsplash.com/photo-${1580618672590 + i}-b8071956e3e8?w=300&h=300&fit=crop`}
                              alt={`Office ${i}`}
                              className="w-full h-full object-cover"
                            />
                            <button className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer">
                          <span className="text-4xl text-gray-400">+</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Show patients your practice environment</p>
                    </div>

                    {/* Before & After Gallery */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Before & After Gallery</h3>
                        <button className="text-blue-600 font-semibold hover:underline text-sm">
                          + Add Case
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <input
                                type="text"
                                placeholder="Treatment name (e.g., Botox for forehead lines)"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <button className="text-red-600 hover:text-red-700">×</button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-semibold mb-2">Before</p>
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400">Upload</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold mb-2">After</p>
                                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400">Upload</span>
                                </div>
                              </div>
                            </div>
                            <textarea
                              rows={2}
                              placeholder="Add notes about this case (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                              type="email"
                              defaultValue="sarah.johnson@example.com"
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
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Practice Address</label>
                          <input
                            type="text"
                            defaultValue="123 Medical Plaza"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Street address"
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              defaultValue="Beverly Hills"
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="City"
                            />
                            <input
                              type="text"
                              defaultValue="CA"
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="State"
                            />
                            <input
                              type="text"
                              defaultValue="90210"
                              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="ZIP"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Website (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://yourwebsite.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Social Media</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600 w-24">Instagram</span>
                              <input
                                type="text"
                                placeholder="@username"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600 w-24">Facebook</span>
                              <input
                                type="text"
                                placeholder="facebook.com/yourpage"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600 w-24">TikTok</span>
                              <input
                                type="text"
                                placeholder="@username"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Office Hours */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-bold mb-4">Office Hours</h3>
                      
                      <div className="space-y-3">
                        {[
                          { day: "Monday", hours: "9:00 AM - 5:00 PM" },
                          { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
                          { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
                          { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
                          { day: "Friday", hours: "9:00 AM - 3:00 PM" },
                          { day: "Saturday", hours: "Closed" },
                          { day: "Sunday", hours: "Closed" },
                        ].map((schedule) => (
                          <div key={schedule.day} className="flex items-center gap-4">
                            <label className="w-28 font-medium">{schedule.day}</label>
                            <input
                              type="text"
                              defaultValue={schedule.hours}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview & Settings */}
                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-6">
                      <h3 className="text-lg font-bold mb-4">Profile Settings</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <div>
                              <p className="font-semibold">Profile Visible</p>
                              <p className="text-xs text-gray-500">Show profile in search results</p>
                            </div>
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5" />
                            <div>
                              <p className="font-semibold">Accept New Patients</p>
                              <p className="text-xs text-gray-500">Allow booking requests</p>
                            </div>
                          </label>
                        </div>

                        <div>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5" />
                            <div>
                              <p className="font-semibold">Instant Booking</p>
                              <p className="text-xs text-gray-500">Let patients book without approval</p>
                            </div>
                          </label>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <label className="block text-sm font-semibold mb-2">Profile Theme Color</label>
                          <div className="flex gap-2">
                            {["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"].map((color) => (
                              <button
                                key={color}
                                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                              ></button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="font-semibold mb-3">Profile Completeness</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Profile completion</span>
                              <span className="font-semibold">85%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <div className="text-xs text-gray-600 mt-3 space-y-1">
                              <p>✓ Profile photo added</p>
                              <p>✓ Bio completed</p>
                              <p>✓ Treatments listed</p>
                              <p className="text-orange-600">⚠ Add before/after photos</p>
                              <p className="text-orange-600">⚠ Add office hours</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                      <h3 className="font-bold mb-2">Premium Plan</h3>
                      <p className="text-sm text-gray-600 mb-4">$299/month • Renews April 1, 2025</p>
                      <button className="w-full bg-white border border-purple-300 text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                        Manage Subscription
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button - Fixed at bottom */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-6 -mb-6 flex gap-4 justify-end">
                  <button className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
                    Save All Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
