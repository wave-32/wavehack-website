"use client";
import { useMemo, useState } from "react";
import { Download, Search, ChevronUp, ChevronDown } from "lucide-react";
import { StatusPill } from "@/components/ui/primitives";
import Papa from "papaparse";

type Row = Record<string, unknown>;

type ColumnDef<T extends Row> = {
  key: keyof T & string;
  label: string;
  render?: (row: T) => React.ReactNode;
  filter?: (row: T, q: string) => boolean;
  sortable?: boolean;
};

type Status =
  | "REGISTERED" | "CONFIRMED" | "WAITLISTED" | "REJECTED"
  | "SUBMITTED" | "REVIEWING" | "ACCEPTED"
  | "NEW_INQUIRY" | "CONTACTED" | "NEGOTIATING" | "CONFIRMED";

export function AdminTable<T extends Row>({
  rows,
  columns,
  statuses,
  onStatusChange,
  filename = "export",
}: {
  rows: T[];
  columns: ColumnDef<T>[];
  statuses?: string[];
  // Takes the row id directly — matches a server action signature.
  onStatusChange?: (id: string, next: string) => Promise<void> | void;
  filename?: string;
}) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filtered = useMemo(() => {
    let list = rows;
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((r) =>
        columns.some((c) => {
          const custom = c.filter ? c.filter(r, needle) : false;
          if (custom) return true;
          const v = r[c.key];
          return typeof v === "string" && v.toLowerCase().includes(needle);
        }),
      );
    }
    if (statusFilter) list = list.filter((r) => (r as Row).status === statusFilter);
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const va = (a as Row)[sortKey];
        const vb = (b as Row)[sortKey];
        const an = typeof va === "string" ? va : String(va ?? "");
        const bn = typeof vb === "string" ? vb : String(vb ?? "");
        return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      });
    }
    return list;
  }, [rows, q, sortKey, sortDir, statusFilter, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function exportCSV() {
    const flat = rows.map((r) => {
      const out: Row = {};
      columns.forEach((c) => {
        const v = r[c.key];
        out[c.label] = typeof v === "string" ? v : v == null ? "" : String(v);
      });
      return out;
    });
    const csv = Papa.unparse(flat);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="w-full pl-9 pr-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-neon-cyan/60"
          />
        </div>
        {statuses && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none"
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-space-900">
                {s}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm hover:bg-white/[0.06] transition"
        >
          <Download className="h-4 w-4" /> CSV
        </button>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-white/50 bg-white/[0.02]">
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3">
                    <button
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 hover:text-white transition"
                    >
                      {c.label}
                      {sortKey === c.key ? (
                        sortDir === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )
                      ) : null}
                    </button>
                  </th>
                ))}
                {onStatusChange && <th className="px-4 py-3">Status</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onStatusChange ? 1 : 0)} className="px-4 py-10 text-center text-white/50">
                    No rows.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-white/[0.03]">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-top">
                        {c.render ? c.render(r) : String(r[c.key] ?? "")}
                      </td>
                    ))}
                    {onStatusChange && (
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <StatusPill status={(r as Row).status as Status} />
                          <select
                            value={String((r as Row).status ?? "")}
                            onChange={(e) => {
                              const next = e.target.value;
                              const id = String((r as Row).id ?? "");
                              if (id) onStatusChange(id, next);
                            }}
                            className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs"
                          >
                            {(statuses ?? []).map((s) => (
                              <option key={s} value={s} className="bg-space-900">
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 text-xs text-white/50 border-t border-white/5">
          {filtered.length} of {rows.length} rows
        </div>
      </div>
    </div>
  );
}
