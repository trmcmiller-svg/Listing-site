import { useState, useEffect } from "react";
import { SearchFilters as SearchFiltersType } from "../services/searchService";
import { US_STATES, EXPERIENCE_OPTIONS } from "../utils/searchUtils";
import { searchService } from "../services/searchService";

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: () => void;
}

export const SearchFilters = ({
  filters,
  onFiltersChange,
  onSearch,
}: SearchFiltersProps) => {
  const [specialties, setSpecialties] = useState<
    Array<{ id: string; name: string; category: string }>
  >([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSpecialties();
  }, []);

  const loadSpecialties = async () => {
    const data = await searchService.getAllSpecialties();
    setSpecialties(data);
  };

  const handleSpecialtyToggle = (specialtyId: string) => {
    const current = filters.specialties || [];
    const updated = current.includes(specialtyId)
      ? current.filter((id) => id !== specialtyId)
      : [...current, specialtyId];

    onFiltersChange({ ...filters, specialties: updated });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: filters.query,
      specialties: [],
      city: undefined,
      state: undefined,
      minYearsExperience: undefined,
      acceptsNewPatients: undefined,
    });
  };

  const activeFilterCount = [
    filters.specialties?.length || 0,
    filters.city ? 1 : 0,
    filters.state ? 1 : 0,
    filters.minYearsExperience ? 1 : 0,
    filters.acceptsNewPatients ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const specialtiesByCategory = specialties.reduce((acc, specialty) => {
    if (!acc[specialty.category]) {
      acc[specialty.category] = [];
    }
    acc[specialty.category].push(specialty);
    return acc;
  }, {} as Record<string, typeof specialties>);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={filters.query || ""}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search by name, specialty, or keyword..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>

        <button
          onClick={onSearch}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Search
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city || ""}
                onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
                placeholder="Enter city"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                value={filters.state || ""}
                onChange={(e) => onFiltersChange({ ...filters, state: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All states</option>
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select
                value={filters.minYearsExperience || 0}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minYearsExperience: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {EXPERIENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.acceptsNewPatients || false}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    acceptsNewPatients: e.target.checked || undefined,
                  })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Accepting new patients only
              </span>
            </label>
          </div>

          {Object.keys(specialtiesByCategory).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Specialties
                </label>
                {(filters.specialties?.length || 0) > 0 && (
                  <button
                    onClick={() => onFiltersChange({ ...filters, specialties: [] })}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear specialties
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto">
                {Object.entries(specialtiesByCategory).map(([category, specs]) => (
                  <div key={category}>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specs.map((specialty) => (
                        <label
                          key={specialty.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={(filters.specialties || []).includes(specialty.id)}
                            onChange={() => handleSpecialtyToggle(specialty.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{specialty.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all filters
            </button>
            <button
              onClick={() => {
                onSearch();
                setShowFilters(false);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
