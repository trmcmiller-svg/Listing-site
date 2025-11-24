import { useState } from "react";
import { Link } from "react-router-dom";
import { CategoryTabs } from "@/sections/CategoryFilter/components/CategoryTabs";
import { MobileFilterButton } from "@/sections/CategoryFilter/components/MobileFilterButton";

const MOCK_PROVIDERS = [
  {
    id: 1,
    name: "TIEV Med Spa",
    type: "Med Spa",
    specialty: "Injectables • IV Therapies • Laser Treatments • Microneedling / PRP • +3 more",
    image: "https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=400&h=250&fit=crop",
    location: "230 E 17th St, Costa Mesa, CA 92627",
    rewards: true,
  },
  {
    id: 2,
    name: "JENNIFER ARMSTRONG MD",
    type: "Medical Doctor (MD)",
    specialty: "Injectables • Body Contouring • Booster Facials • Laser Treatments • Microneedling / PRP",
    image: "https://images.unsplash.com/photo-1580618672590-b8071956e3e8?w=400&h=250&fit=crop",
    location: "369 San Miguel Dr, Newport Beach, CA 92660",
    rewards: true,
  },
  {
    id: 3,
    name: "Dr. Emily White",
    type: "Dermatologist",
    specialty: "Acne Treatment • Chemical Peels • Botox",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop",
    location: "100 Ocean Ave, Laguna Beach, CA 92651",
    rewards: false,
  },
  {
    id: 4,
    name: "Coastal Aesthetics",
    type: "Med Spa",
    specialty: "HydraFacial • Microdermabrasion • Fillers",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=250&fit=crop",
    location: "500 Pacific Coast Hwy, Huntington Beach, CA 92648",
    rewards: false,
  },
  {
    id: 5,
    name: "The Skin Clinic",
    type: "Aesthetician",
    specialty: "Custom Facials • Microcurrent • LED Therapy",
    image: "https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=400&h=250&fit=crop",
    location: "789 Main St, Irvine, CA 92604",
    rewards: false,
  },
];

export const SearchPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Search Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-xl">
            ←
          </Link>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search experts"
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>
          <Link
            to="/provider-signup"
            className="hidden md:block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Become an expert
          </Link>
          <button className="hidden md:block text-gray-600 hover:text-gray-900">
            👤
          </button>
        </div>

        <p className="text-gray-500 text-lg md:text-2xl leading-relaxed mb-6">
          <span className="text-black font-medium">Choose an expert.</span> Book a session. Get advice over a video call.
        </p>

        <div className="flex items-center justify-between mb-6">
          <CategoryTabs />
          <MobileFilterButton />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Column - Search Results & Filters */}
        <div className={`w-full md:w-1/3 lg:w-2/5 xl:w-1/3 flex-shrink-0 border-r border-gray-200 ${showMap ? 'md:block' : 'block'}`}>
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-xl font-bold">Showing {MOCK_PROVIDERS.length} Results</h1>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMap(!showMap)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
              >
                <span className="text-lg">⚙️</span> Filters
              </button>
            </div>
          </div>

          {/* Filters (conditionally rendered) */}
          {showFilters && (
            <div className="p-6 border-b border-gray-200 bg-gray-50 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Practice Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>Med Spa</option>
                  <option>Medical Doctor (MD)</option>
                  <option>Nurse Practitioner (NP)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Specialty</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All</option>
                  <option>Injectables</option>
                  <option>Laser Treatments</option>
                  <option>Body Contouring</option>
                </select>
              </div>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Apply Filters
              </button>
            </div>
          )}

          {/* Search Results List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {MOCK_PROVIDERS.map((provider) => (
              <Link
                key={provider.id}
                to={`/provider/${provider.id}`}
                className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-40 h-32 md:h-auto flex-shrink-0">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">{provider.name}</h3>
                      {provider.rewards && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                          REWARDS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{provider.specialty}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>📍</span> {provider.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {/* Ad Banner */}
            <div className="bg-black text-white rounded-lg overflow-hidden mt-6">
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1590487988256-93e4d966629b?w=300&h=200&fit=crop"
                  alt="Ad"
                  className="w-1/2 h-auto object-cover"
                />
                <div className="p-4 flex-1">
                  <h3 className="text-xl font-bold mb-2">EVOLUS REWARDS™</h3>
                  <p className="text-sm mb-3">$40 OFF JEUVEAU AND $40 OFF EVOLYSSE</p>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700">
                    JOIN NOW →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Map View */}
        <div className={`flex-1 relative ${showMap ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-0 h-full w-full bg-gray-300 flex items-center justify-center text-gray-600">
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Newport+Beach,CA&zoom=12&size=600x800&maptype=roadmap&markers=color:red%7Clabel:A%7C230+E+17th+St,Costa+Mesa,CA&markers=color:blue%7Clabel:B%7C369+San+Miguel+Dr,Newport+Beach,CA&key=YOUR_GOOGLE_MAPS_API_KEY"
              alt="Map of Newport Beach"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white rounded-full shadow-md p-2 flex flex-col gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full">+</button>
              <button className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded-full">-</button>
            </div>
            <button className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-full shadow-md text-sm flex items-center gap-2 hover:bg-gray-100">
              <input type="checkbox" className="w-4 h-4" /> Search as I move the map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
