import { useState } from "react";

type MessageSearchProps = {
  conversationId: string;
  messages: Array<{
    id: string;
    content: string;
    timestamp: Date;
  }>;
  onResultClick: (messageId: string) => void;
};

export const MessageSearch = ({ conversationId, messages, onResultClick }: MessageSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof messages>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = messages.filter((msg) =>
      msg.content.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search in conversation..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onResultClick(result.id);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <p className="text-sm truncate">{result.content}</p>
              <p className="text-xs text-gray-500">{result.timestamp.toLocaleDateString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
