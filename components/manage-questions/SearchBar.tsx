import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SearchBarProps = {
  onSearch: (term: string) => void;
  onToggleUnapproved: (showOnlyUnapproved: boolean) => void;
  showOnlyUnapproved: boolean;
  totalQuestions: number;
  filteredQuestions: number;
};

export function SearchBar({
  onSearch,
  onToggleUnapproved,
  showOnlyUnapproved,
  totalQuestions,
  filteredQuestions,
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleToggleUnapproved = (checked: boolean) => {
    onToggleUnapproved(checked);
  };

  useEffect(() => {
    onSearch(searchTerm);
  }, [showOnlyUnapproved, onSearch, searchTerm]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-2/3">
          <Input
            type="text"
            placeholder="Search questions..."
            onChange={handleSearch}
            value={searchTerm}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="unapproved-mode"
            checked={showOnlyUnapproved}
            onCheckedChange={handleToggleUnapproved}
          />
          <Label htmlFor="unapproved-mode">Show only unapproved</Label>
        </div>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
        {filteredQuestions === totalQuestions
          ? `Total Questions: ${totalQuestions}`
          : `Showing ${filteredQuestions} question${
              filteredQuestions !== 1 ? "s" : ""
            }`}
      </div>
    </div>
  );
}
