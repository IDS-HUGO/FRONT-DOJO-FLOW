export interface SearchFilterProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value: string;
}

export function SearchFilter({ placeholder = "Buscar...", onSearch, value }: SearchFilterProps) {
  return (
    <div className="search-filter surface-glass">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        className="search-filter-input"
      />
    </div>
  );
}
