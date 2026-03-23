export interface SearchFilterProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value: string;
}

export function SearchFilter({ placeholder = "Buscar...", onSearch, value }: SearchFilterProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          fontSize: '0.875rem',
        }}
      />
    </div>
  );
}
