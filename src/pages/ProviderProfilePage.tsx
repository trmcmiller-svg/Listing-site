import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { recordTrustEvent } from "../utils/trustEngine";
import { TrustBadges, TrustScore } from "../components/TrustBadges";

export const ProviderProfilePage = () => {
  const { providerId } = useParams();
  const [activeTab, setActiveTab] = useState<"reviews" | "about" | "expertise" | "location" | "photos" | "qna">("reviews");

  useEffect(() => {
    if (providerId) {
      recordTrustEvent("profile_view", providerId);
    }
  }, [providerId]);

  const providerData = {
    id: providerId || "1",
    name: "Luiza Brows",
    title: "Microblading Specialist",
    rating: 4.8,
    reviewCount: 236,
    address: "1900 The Exchange SE, Bldg 300, Ste 300, Atlanta, Georgia, 30339",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1600&h=400&fit=crop",
    bio: "Luiza is a highly skilled microblading specialist with over 10 years of experience. She is passionate about creating natural-looking brows that enhance her clients' features. Luiza is dedicated to providing a comfortable and personalized experience for every client.",
    yearsExperience: "10 years",
    education: [
      { degree: "Certified Microblading Artist", school: "Brow Academy", year: "2014" },
      { degree: "Advanced Pigmentology Course", school: "Elite PMU", year: "2018" },
    ],
    specialties: ["Microblading", "Ombre Brows", "Powder Brows", "Brow Lamination"],
    treatments: [
      { name: "Microblading", price: "$500-700", duration: "2 hours" },
      { name: "Ombre Brows", price: "$550-750", duration: "2.5 hours" },
      { name: "Brow Touch-up", price: "$150-200", duration: "1 hour" },
    ],
    officePhotos: [
      "https://images.unsplash.com/photo-1580618672590-b8071956e3e8?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1580618672591-b8071956e3e8?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1580618672592-b8071956e3e8?w=300&h=300&fit=crop",
    ],
    beforeAfterPhotos: {
      "Microblading": [
        { before: "https://images.unsplash.com/photo-1580618672593-b8071956e3e8?w=400&h=400&fit=crop", after: "https://images.unsplash.com/photo-1580618672594-b8071956e3e8?w=400&h=400&fit=crop" },
        { before: "https://images.unsplash.com/photo-1580618672595-b8071956e3e8?w=400&h=400&fit=crop", after: "https://images.unsplash.com/photo-1580618672596-b8071956e3e8?w=400&h=400&fit=crop" },
      ],
      "Ombre Brows": [
        { before: "https://images.unsplash.com/photo-1580618672597-b8071956e3e8?w=400&h=400&fit=crop", after: "https://images.unsplash.com/photo-1580618672598-b8071956e3e8?w=400&h=400&fit=crop" },
      ],
    },
    qna: [
      { question: "How long does microblading last?", answer: "Typically 1-3 years, depending on skin type and aftercare." },
      { question: "Is microblading painful?", answer: "Most clients report minimal discomfort, similar to threading." },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/provider-dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-1 mb-4">
          <span className="text-xl">←</span> Back to Dashboard
        </Link>

        {/* Provider Header Section */}
        <div className="relative bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Cover Image */}
          <div className="w-full h-48 bg-gray-200 overflow-hidden">
            <img
              src={providerData.coverImage}
              alt={`${providerData.name} cover`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 pt-0 md:flex">
            {/* Profile Image */}
            <div className="relative -mt-20 md:-mt-16 w-36 h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md overflow-hidden flex-shrink-0">
              <img
                src={providerData.profileImage}
                alt={providerData.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 md:ml-6 mt-4 md:mt-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold">{providerData.name}</h1>
                  <p className="text-lg text-gray-600">{providerData.title}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-500 text-2xl">★</span>
                    <span className="text-2xl font-bold">{providerData.rating}</span>
                  </div>
                  <p className="text-gray-600">{providerData.reviewCount} reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <span>📍</span>
                <span>{providerData.address}</span>
              </div>

              <div className="mb-4 space-y-2">
                <TrustBadges practitionerId={providerData.id} showLabels={true} />
                <TrustScore practitionerId={providerData.id} />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => recordTrustEvent("consult_request_sent", providerData.id)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get a Consultation
                </button>
                <Link
                  to="/messages"
                  className="border-2 border-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors"
                >
                  Message Provider
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {[
                { id: "reviews", label: "REVIEWS" },
                { id: "about", label: "ABOUT" },
                { id: "expertise", label: "EXPERTISE" },
                { id: "location", label: "LOCATION" },
                { id: "photos", label: "PHOTOS" },
                { id: "qna", label: "Q&A" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 font-semibold whitespace-nowrap transition-colors uppercase text-sm ${
                    activeTab === tab.id
                      ? "border-b-2 border-black text-black"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl font-bold">{providerData.rating}</span>
                      <div>
                        <div className="flex text-yellow-500 text-xl">★★★★★</div>
                        <p className="text-gray-600">Based on {providerData.reviewCount} reviews</p>
                      </div>
                    </div>
                  </div>
                  <button className="border-2 border-gray-300 px-6 py-2 rounded-lg font-semibold hover:border-gray-400">
                    Write a Review
                  </button>
                </div>

                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div>
                          <p className="font-semibold">Jennifer M.</p>
                          <p className="text-sm text-gray-500">Verified Patient • 2 weeks ago</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-500">★★★★★</div>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Luiza is amazing! I came in for microblading, and the results are 
                      exactly what I wanted - natural and subtle. She took the time to explain 
                      everything and made me feel comfortable throughout the process.
                    </p>
                    <div className="flex gap-2">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        Microblading
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">About {providerData.name}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {providerData.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Experience & Education</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-semibold">{providerData.yearsExperience}</p>
                        <p className="text-gray-600">In Aesthetic Industry</p>
                      </div>
                    </div>
                    {providerData.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-semibold">{edu.degree}</p>
                          <p className="text-gray-600">{edu.school}, {edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "expertise" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {providerData.specialties.map((specialty) => (
                      <span key={specialty} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Treatments & Pricing</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {providerData.treatments.map((treatment) => (
                      <div key={treatment.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{treatment.name}</span>
                          <p className="text-sm text-gray-600">{treatment.duration}</p>
                        </div>
                        <span className="text-gray-600 font-semibold">{treatment.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Office Location</h3>
                <p className="text-lg text-gray-700 mb-4">{providerData.address}</p>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500">
                  Map Placeholder
                </div>
                <h3 className="text-xl font-bold mt-8 mb-4">Office Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {providerData.officePhotos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Office ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "photos" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold">BEFORE AND AFTER PHOTOS</h2>
                  <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    BROWSE ALL {Object.values(providerData.beforeAfterPhotos).flat().length} PHOTOS
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(providerData.beforeAfterPhotos).map(([treatment, photos]) => (
                    <div key={treatment} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-4">
                        <h3 className="text-lg font-bold mb-1">{treatment.toUpperCase()}</h3>
                        <p className="text-sm text-gray-600">{photos.length} images</p>
                      </div>
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={photos[0].before} // Displaying the first 'before' image as a preview
                          alt={`${treatment} before`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xl font-bold">
                          <span className="text-5xl">👁️‍🗨️</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "qna" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Questions & Answers</h2>
                <div className="space-y-4">
                  {providerData.qna.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-bold mb-2">Q: {item.question}</p>
                      <p className="text-gray-700">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                  Ask a Question
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
