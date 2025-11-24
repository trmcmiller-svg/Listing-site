import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Just Gorge
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              The trusted platform connecting patients with verified aesthetic professionals
            </p>
            <Link
              to="/join"
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Hero - For Patients */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-8 md:mb-12">
          <p className="text-gray-500 text-lg md:text-2xl leading-relaxed mb-4">
            <span className="text-black font-medium">Choose a provider.</span> Book a consultation. Get expert aesthetic care.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
          <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            All Providers
          </button>
          <button className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium whitespace-nowrap">
            Top Rated
          </button>
          <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            Botox & Fillers
          </button>
          <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            Laser Treatments
          </button>
          <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            Skincare
          </button>
          <button className="px-6 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition-colors">
            Body Contouring
          </button>
        </div>

        {/* Main Heading */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl mb-4">
            <span className="text-black font-medium">Top Providers.</span>
            <span className="text-gray-500"> Access to verified aesthetic professionals has never been easier</span>
          </h1>
        </div>

        {/* Provider Slider */}
        <div className="relative overflow-hidden">
          <div className="flex gap-5 pb-4 animate-scroll hover:paused">
            {[...Array(2)].flatMap((_, arrayIndex) => [
              {
                name: "Dr. Sarah Johnson",
                title: "MD",
                specialty: "Dermatology & Injectables",
                experience: "15 years experience",
                price: "$400",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Jessica Martinez",
                title: "NP",
                specialty: "Fillers & Skincare",
                experience: "10 years experience",
                price: "$300",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Emily Chen",
                title: "Licensed Aesthetician",
                specialty: "Advanced Skincare",
                experience: "8 years experience",
                price: "$200",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Dr. Michael Torres",
                title: "MD",
                specialty: "Cosmetic Dermatology",
                experience: "12 years experience",
                price: "$450",
                image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Amanda Rodriguez",
                title: "Laser Technician",
                specialty: "Laser Treatments",
                experience: "6 years experience",
                price: "$250",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Dr. James Park",
                title: "MD",
                specialty: "Plastic Surgery",
                experience: "20 years experience",
                price: "$500",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Lisa Thompson",
                title: "Medical Aesthetician",
                specialty: "Facial Treatments",
                experience: "7 years experience",
                price: "$180",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Dr. Rachel Kim",
                title: "MD",
                specialty: "Facial Rejuvenation",
                experience: "14 years experience",
                price: "$425",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Marcus Williams",
                title: "Body Sculpting Specialist",
                specialty: "Body Contouring",
                experience: "9 years experience",
                price: "$350",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Dr. Sofia Martinez",
                title: "MD",
                specialty: "Anti-Aging Medicine",
                experience: "18 years experience",
                price: "$475",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Nicole Anderson",
                title: "RN",
                specialty: "Skincare & Wellness",
                experience: "11 years experience",
                price: "$220",
                image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=500&fit=crop",
                verified: true,
              },
              {
                name: "Dr. David Chen",
                title: "MD",
                specialty: "Cosmetic Procedures",
                experience: "16 years experience",
                price: "$550",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
                verified: true,
              },
            ]).map((provider, index) => (
              <Link
                key={index}
                to={`/provider/${(index % 12) + 1}`}
                className="group cursor-pointer flex-shrink-0 w-[160px] md:w-[200px]"
              >
                <div className="relative aspect-[0.82/1] mb-3 rounded-lg overflow-hidden">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  {provider.verified && (
                    <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold">
                      Top Provider
                    </div>
                  )}
                  <button className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs">♡</span>
                  </button>
                </div>
                <h3 className="text-base md:text-lg font-semibold truncate mb-1">
                  {provider.name}, {provider.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{provider.specialty}</p>
                <p className="text-xs md:text-sm text-gray-500">{provider.experience}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Link
            to="/search"
            className="px-8 py-3 border-2 border-gray-900 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Find Providers in your Area
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div 
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&h=800&fit=crop')"
        }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-light mb-8 leading-tight">
            Get $50 off your first consultation & exclusive offers
          </h2>
          <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-lg"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
