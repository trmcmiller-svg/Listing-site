import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface OnboardingStep {
  title: string;
  description: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  { title: "Professional Information", description: "Tell us about your practice" },
  { title: "License Details", description: "Add your professional credentials" },
  { title: "Document Upload", description: "Upload verification documents" },
  { title: "Profile Setup", description: "Complete your public profile" },
  { title: "Review & Submit", description: "Review and submit for verification" },
];

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [practitionerId, setPractitionerId] = useState<string>("");

  const [formData, setFormData] = useState({
    professionalTitle: "",
    practitionerType: "",
    yearsExperience: "",
    bio: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    specialties: [] as string[],
    education: [""],
  });

  const [uploadedDocs, setUploadedDocs] = useState({
    license: null as File | null,
    insurance: null as File | null,
  });

  useEffect(() => {
    loadPractitionerData();
  }, [user]);

  const loadPractitionerData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("practitioners")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setPractitionerId(data.id);
      setCurrentStep(data.onboarding_step || 0);

      setFormData({
        professionalTitle: data.professional_title || "",
        practitionerType: data.practitioner_type || "",
        yearsExperience: data.years_experience?.toString() || "",
        bio: data.bio || "",
        businessAddress: "",
        city: "",
        state: "",
        zipCode: "",
        licenseNumber: "",
        licenseState: "",
        licenseExpiry: "",
        specialties: data.specialties || [],
        education: data.education || [""],
      });
    }
  };

  const handleNext = async () => {
    setError("");
    setLoading(true);

    try {
      if (currentStep === 0) {
        await saveBasicInfo();
      } else if (currentStep === 1) {
        await saveLicenseInfo();
      } else if (currentStep === 2) {
        await uploadDocuments();
      } else if (currentStep === 3) {
        await saveProfile();
      } else if (currentStep === 4) {
        await submitForVerification();
        onComplete();
        return;
      }

      await supabase
        .from("practitioners")
        .update({ onboarding_step: currentStep + 1 })
        .eq("id", practitionerId);

      setCurrentStep(currentStep + 1);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const saveBasicInfo = async () => {
    if (!formData.professionalTitle || !formData.practitionerType || !formData.yearsExperience) {
      throw new Error("Please fill in all required fields");
    }

    const { error } = await supabase
      .from("practitioners")
      .update({
        professional_title: formData.professionalTitle,
        practitioner_type: formData.practitionerType,
        years_experience: parseInt(formData.yearsExperience),
      })
      .eq("id", practitionerId);

    if (error) throw error;
  };

  const saveLicenseInfo = async () => {
    if (!formData.licenseNumber || !formData.licenseState || !formData.licenseExpiry) {
      throw new Error("Please fill in all license fields");
    }

    const { error } = await supabase
      .from("practitioner_licenses")
      .insert({
        practitioner_id: practitionerId,
        license_type: "Professional License",
        license_number: formData.licenseNumber,
        issuing_state: formData.licenseState,
        expiration_date: formData.licenseExpiry,
        is_active: true,
      });

    if (error) throw error;
  };

  const uploadDocuments = async () => {
    if (!uploadedDocs.license) {
      throw new Error("Please upload your license document");
    }

    const licenseFileName = `${practitionerId}/license_${Date.now()}_${uploadedDocs.license.name}`;

    const { error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(licenseFileName, uploadedDocs.license);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("verification-documents")
      .getPublicUrl(licenseFileName);

    await supabase
      .from("practitioner_licenses")
      .update({ document_url: publicUrl })
      .eq("practitioner_id", practitionerId);

    if (uploadedDocs.insurance) {
      const insuranceFileName = `${practitionerId}/insurance_${Date.now()}_${uploadedDocs.insurance.name}`;

      await supabase.storage
        .from("verification-documents")
        .upload(insuranceFileName, uploadedDocs.insurance);

      const { data: { publicUrl: insuranceUrl } } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(insuranceFileName);

      await supabase.from("practitioner_insurance").insert({
        practitioner_id: practitionerId,
        insurance_type: "malpractice",
        provider_name: "To be verified",
        policy_number: "To be verified",
        effective_date: new Date().toISOString().split("T")[0],
        expiration_date: formData.licenseExpiry,
        document_url: insuranceUrl,
      });
    }
  };

  const saveProfile = async () => {
    if (!formData.bio || formData.bio.length < 50) {
      throw new Error("Please write a bio (at least 50 characters)");
    }

    const { error } = await supabase
      .from("practitioners")
      .update({
        bio: formData.bio,
        education: formData.education.filter(e => e.trim()),
      })
      .eq("id", practitionerId);

    if (error) throw error;
  };

  const submitForVerification = async () => {
    const { error } = await supabase.rpc("submit_verification_request", {
      p_practitioner_id: practitionerId,
    });

    if (error) throw error;

    await supabase
      .from("practitioners")
      .update({
        onboarding_completed: true,
        onboarding_step: 5,
      })
      .eq("id", practitionerId);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div key={index} className="flex-1 mx-1">
              <div
                className={`h-2 rounded-full ${
                  index <= currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold">{ONBOARDING_STEPS[currentStep].title}</h2>
          <p className="text-gray-600">{ONBOARDING_STEPS[currentStep].description}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-8">
        {currentStep === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Professional Title *</label>
              <input
                type="text"
                value={formData.professionalTitle}
                onChange={e => setFormData({ ...formData, professionalTitle: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Board Certified Dermatologist"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Practitioner Type *</label>
              <select
                value={formData.practitionerType}
                onChange={e => setFormData({ ...formData, practitionerType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="md">Medical Doctor (MD/DO)</option>
                <option value="np">Nurse Practitioner (NP)</option>
                <option value="pa">Physician Assistant (PA)</option>
                <option value="rn">Registered Nurse (RN)</option>
                <option value="aesthetician">Licensed Aesthetician</option>
                <option value="laser_tech">Laser Technician</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Years of Experience *</label>
              <input
                type="number"
                value={formData.yearsExperience}
                onChange={e => setFormData({ ...formData, yearsExperience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                min="0"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">License Number *</label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CA-A123456"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">License State *</label>
              <input
                type="text"
                value={formData.licenseState}
                onChange={e => setFormData({ ...formData, licenseState: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">License Expiry Date *</label>
              <input
                type="date"
                value={formData.licenseExpiry}
                onChange={e => setFormData({ ...formData, licenseExpiry: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Specialties</label>
              <div className="grid grid-cols-2 gap-2">
                {["Botox", "Dermal Fillers", "Laser Treatments", "Chemical Peels", "Microneedling", "Body Contouring"].map(specialty => (
                  <label key={specialty} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Professional License Document *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setUploadedDocs({ ...uploadedDocs, license: e.target.files?.[0] || null })}
                  className="hidden"
                  id="license-upload"
                />
                <label htmlFor="license-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  {uploadedDocs.license ? (
                    <p className="text-green-600 font-medium">{uploadedDocs.license.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">Click to upload license</p>
                      <p className="text-sm text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Malpractice Insurance (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setUploadedDocs({ ...uploadedDocs, insurance: e.target.files?.[0] || null })}
                  className="hidden"
                  id="insurance-upload"
                />
                <label htmlFor="insurance-upload" className="cursor-pointer">
                  <div className="text-4xl mb-2">📄</div>
                  {uploadedDocs.insurance ? (
                    <p className="text-green-600 font-medium">{uploadedDocs.insurance.name}</p>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-2">Click to upload insurance</p>
                      <p className="text-sm text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Professional Bio *</label>
              <textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell patients about your experience, approach, and what makes you unique..."
              />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length} / 50 characters minimum</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Education</label>
              {formData.education.map((edu, index) => (
                <input
                  key={index}
                  type="text"
                  value={edu}
                  onChange={e => {
                    const newEducation = [...formData.education];
                    newEducation[index] = e.target.value;
                    setFormData({ ...formData, education: newEducation });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  placeholder="e.g., UCLA School of Medicine"
                />
              ))}
              <button
                onClick={() => setFormData({ ...formData, education: [...formData.education, ""] })}
                className="text-blue-600 text-sm font-medium"
              >
                + Add another
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Review Your Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Title:</span> {formData.professionalTitle}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {formData.practitionerType}
                </div>
                <div>
                  <span className="font-medium">Experience:</span> {formData.yearsExperience} years
                </div>
                <div>
                  <span className="font-medium">License:</span> {formData.licenseNumber} ({formData.licenseState})
                </div>
                <div>
                  <span className="font-medium">Documents:</span> License uploaded{uploadedDocs.insurance && ", Insurance uploaded"}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                By submitting, you confirm that all information provided is accurate and complete. Our team will review your application within 2-3 business days.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className="ml-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? "Processing..." : currentStep === 4 ? "Submit for Verification" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}