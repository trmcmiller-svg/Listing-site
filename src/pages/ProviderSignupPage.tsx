import { useState } from "react";

export const ProviderSignupPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  return (
    <div className="min-h-screen bg-[#E8E8E4] py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  s <= step ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <p className="text-center text-gray-600">
            Step {step} of 4: {
              step === 1 ? "Basic Information" :
              step === 2 ? "Professional Details" :
              step === 3 ? "License Verification" :
              "Profile Setup"
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Let's get started</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Dr. Jane Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Provider Type *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select your provider type</option>
                  <option value="md">Medical Doctor (MD/DO)</option>
                  <option value="np">Nurse Practitioner (NP)</option>
                  <option value="pa">Physician Assistant (PA)</option>
                  <option value="rn">Registered Nurse (RN)</option>
                  <option value="aesthetician">Licensed Aesthetician</option>
                  <option value="laser-tech">Laser Technician</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Business Name</label>
                <input
                  type="text"
                  placeholder="Your practice or business name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Professional Details</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Years of Experience *</label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Specialties *</label>
                <div className="space-y-2">
                  {[
                    "Botox & Injectables",
                    "Dermal Fillers",
                    "Laser Treatments",
                    "Chemical Peels",
                    "Microneedling",
                    "Body Contouring",
                  ].map((specialty) => (
                    <label key={specialty} className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Practice Address *</label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">License Verification</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Why we verify:</strong> We verify all provider credentials to ensure 
                  patient safety and build trust on our platform.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Professional License Number *</label>
                <input
                  type="text"
                  placeholder="e.g., CA-A123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">License State *</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select state</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Upload License Document *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600 mb-2">Drag and drop or click to upload</p>
                  <p className="text-sm text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Choose File
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Malpractice Insurance</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600 mb-2">Upload proof of insurance (optional)</p>
                  <button className="mt-4 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Profile Photo *</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Upload Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Bio *</label>
                <textarea
                  rows={6}
                  placeholder="Tell patients about your experience, approach, and what makes you unique..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Education</label>
                <input
                  type="text"
                  placeholder="e.g., UCLA School of Medicine"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <input
                  type="text"
                  placeholder="Add another degree or certification"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Choose Your Plan</label>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Free", price: "$0", features: ["Basic listing", "Limited visibility"] },
                    { name: "Pro", price: "$99/mo", features: ["Enhanced profile", "Priority placement", "Analytics"] },
                    { name: "Premium", price: "$299/mo", features: ["Top placement", "Featured badge", "Advanced tools"] },
                  ].map((plan) => (
                    <div 
                      key={plan.name} 
                      onClick={() => setSelectedPlan(plan.name)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlan === plan.name 
                          ? "border-blue-600 bg-blue-50" 
                          : "border-gray-300 hover:border-blue-600"
                      }`}
                    >
                      <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                      <p className="text-2xl font-bold mb-4">{plan.price}</p>
                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400"
              >
                Back
              </button>
            )}
            <button
              onClick={() => step < 4 ? setStep(step + 1) : alert("Application submitted!")}
              className="ml-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {step < 4 ? "Continue" : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
