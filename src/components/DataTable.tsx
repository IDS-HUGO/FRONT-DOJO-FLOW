import { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
  emptyMessage?: string;
}

export function DataTable({ headers, rows, caption, emptyMessage = "No hay registros todavía." }: DataTableProps) {
  return (
    <div className="card table-shell surface-glass">
      {caption && <p className="table-caption">{caption}</p>}
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
