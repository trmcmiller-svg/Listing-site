import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchFilters } from "../components/SearchFilters";
import { SearchResultCard } from "../components/SearchResultCard";
import { useAuth } from "../contexts/AuthContext";
import {
  searchService,
  SearchFilters as SearchFiltersType,
  PractitionerSearchResult,
} from "../services/searchService";
import { buildSearchQuery, parseSearchQuery } from "../utils/searchUtils";

export const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [filters, setFilters] = useState<SearchFiltersType>(() =>
    parseSearchQuery(location.search)
  );
  const [results, setResults] = useState<PractitionerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAnalyticsId, setSearchAnalyticsId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const filtersFromUrl = parseSearchQuery(location.search);
    setFilters(filtersFromUrl);
    performSearch(filtersFromUrl);
  }, [location.search]);

  const performSearch = async (searchFilters: SearchFiltersType, pageNum: number = 0) => {
    setLoading(true);

    const { results: searchResults } = await searchService.searchPractitioners({
      ...searchFilters,
      limit: 20,
      offset: pageNum * 20,
    });

    if (pageNum === 0) {
      setResults(searchResults);

      const analyticsId = await searchService.trackSearch(
        searchFilters.query || "",
        searchFilters,
        searchResults.length,
        user?.id
      );
      setSearchAnalyticsId(analyticsId);
    } else {
      setResults((prev) => [...prev, ...searchResults]);
    }

    setHasMore(searchResults.length === 20);
    setPage(pageNum);
    setLoading(false);
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    const queryString = buildSearchQuery(filters);
    navigate(`/search?${queryString}`);
  };

  const handlePractitionerClick = (practitionerId: string) => {
    if (searchAnalyticsId) {
      searchService.trackPractitionerClick(searchAnalyticsId, practitionerId);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      performSearch(filters, page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Provider</h1>
          <p className="text-gray-600">
            Search verified medical aesthetics practitioners in your area
          </p>
        </div>

        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {loading && page === 0 ? (
                "Searching..."
              ) : (
                <>
                  {results.length === 0
                    ? "No results found"
                    : `${results.length} ${results.length === 1 ? "Provider" : "Providers"} Found`}
                </>
              )}
            </h2>

            {results.length > 0 && (
              <div className="text-sm text-gray-600">
                Sorted by trust score and relevance
              </div>
            )}
          </div>
        </div>

        {loading && page === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Searching for providers...</p>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No providers found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setFilters({ query: "" });
                navigate("/search");
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {results.map((practitioner) => (
                <SearchResultCard
                  key={practitioner.id}
                  practitioner={practitioner}
                  onClickTracking={handlePractitionerClick}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
