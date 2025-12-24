type Column<T> = {
  header: string;
  accessor: keyof T;
  align?: "left" | "right" | "center";
  className?: string;
};

interface SimpleTableProps<T extends Record<string, string | number> & { __key?: string }> {
  columns: Column<T>[];
  rows: T[];
}

const alignMap = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

function SimpleTable<T extends Record<string, string | number> & { __key?: string }>({ columns, rows }: SimpleTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_70px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] text-xs font-semibold text-white/70 bg-white/5 border-b border-white/10">
        {columns.map((col) => (
          <div key={col.header} className={`px-3 py-2 ${alignMap[col.align ?? "left"]}`}>
            {col.header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-white/10 text-sm text-white/80">
        {rows.map((row) => {
          const compositeKey = columns.map((col) => String((row as any)[col.accessor] ?? "")).join("|");
          const rowKey = (row as any).__key ?? (compositeKey || JSON.stringify(row));
          return (
            <div key={rowKey} className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
              {columns.map((col) => (
                <div
                  key={String(col.accessor)}
                  className={`px-3 py-2 ${alignMap[col.align ?? "left"]} ${col.className ?? ""}`.trim()}
                >
                  {row[col.accessor] as any}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SimpleTable;
