"use client";
import { useMemo, useState } from "react";
import { NeonButton } from "@/components/ui/primitives";
import { Trash2, Save, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Kind = { key: string; label: string };

// Per-kind editor schema hints. They affect the suggested field layout.
const SCHEMAS: Record<
  string,
  { fields: { name: string; label: string; type?: "text" | "long" | "number" | "url" | "select"; options?: string[] }[] }
> = {
  sponsor: {
    fields: [
      { name: "name", label: "Name" },
      { name: "tier", label: "Tier", type: "select", options: ["platinum", "gold", "prize", "community"] },
      { name: "url", label: "URL", type: "url" },
      { name: "logoUrl", label: "Logo URL", type: "url" },
      { name: "blurb", label: "Blurb", type: "text" },
    ],
  },
  winner: {
    fields: [
      { name: "teamName", label: "Team" },
      { name: "projectName", label: "Project" },
      { name: "description", label: "Description", type: "long" },
      { name: "members", label: "Members (comma-separated)" },
      { name: "prize", label: "Prize" },
      { name: "event", label: "Event" },
      { name: "year", label: "Year", type: "number" },
      { name: "github", label: "GitHub", type: "url" },
      { name: "demo", label: "Demo", type: "url" },
    ],
  },
  team_member: { fields: [
    { name: "name", label: "Name" },
    { name: "role", label: "Role" },
    { name: "bio", label: "Bio", type: "long" },
    { name: "photoUrl", label: "Photo URL", type: "url" },
  ] },
  judge: { fields: [
    { name: "name", label: "Name" },
    { name: "role", label: "Specialty" },
    { name: "bio", label: "Bio", type: "long" },
    { name: "photoUrl", label: "Photo URL", type: "url" },
  ] },
  speaker: { fields: [
    { name: "name", label: "Name" },
    { name: "role", label: "Talk title" },
    { name: "bio", label: "Bio", type: "long" },
    { name: "photoUrl", label: "Photo URL", type: "url" },
  ] },
  mentor: { fields: [
    { name: "name", label: "Name" },
    { name: "role", label: "Domain" },
    { name: "bio", label: "Bio", type: "long" },
    { name: "photoUrl", label: "Photo URL", type: "url" },
  ] },
  gallery: { fields: [
    { name: "title", label: "Title" },
    { name: "imageUrl", label: "Image URL", type: "url" },
    { name: "caption", label: "Caption" },
  ] },
  stat: { fields: [
    { name: "label", label: "Label" },
    { name: "value", label: "Value", type: "number" },
    { name: "suffix", label: "Suffix" },
    { name: "prefix", label: "Prefix" },
    { name: "blurb", label: "Blurb", type: "text" },
  ] },
  faq: { fields: [
    { name: "q", label: "Question" },
    { name: "a", label: "Answer", type: "long" },
  ] },
  event: { fields: [
    { name: "date", label: "Date (display)" },
    { name: "location", label: "Location" },
    { name: "eligibility", label: "Eligibility" },
    { name: "teamSize", label: "Team size" },
  ] },
  testimonial: { fields: [
    { name: "name", label: "Name" },
    { name: "quote", label: "Quote", type: "long" },
    { name: "role", label: "Role" },
  ] },
};

export function AdminContentEditor({
  kinds,
  grouped,
}: {
  kinds: Kind[];
  grouped: Record<string, unknown[]>;
}) {
  const [tab, setTab] = useState<string>(kinds[0]?.key ?? "sponsor");
  const [busy, setBusy] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, Record<string, string>>>({});

  const items = useMemo(() => {
    return (grouped[tab] ?? []) as { key?: string; data?: unknown }[];
  }, [tab, grouped]);

  async function save(kind: string, item: string, data: Record<string, unknown>) {
    setBusy(`save:${kind}:${item}`);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, key: item, data, order: 0 }),
      });
      if (!res.ok) throw new Error(await res.text());
    } finally {
      setBusy(null);
    }
  }
  async function remove(kind: string, item: string) {
    if (!confirm("Delete this item?")) return;
    setBusy(`del:${kind}:${item}`);
    try {
      await fetch(`/api/content?kind=${kind}&key=${encodeURIComponent(item)}`, { method: "DELETE" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {kinds.map((k) => (
          <button
            key={k.key}
            onClick={() => setTab(k.key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm border transition",
              tab === k.key
                ? "border-neon-cyan/60 bg-neon-cyan/10 text-white"
                : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.06]",
            )}
          >
            {k.label} <span className="text-[10px] text-white/40">({(grouped[k.key] ?? []).length})</span>
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {items.length === 0 && (
          <div className="glass rounded-2xl p-6 text-white/60 text-sm">
            No items yet. Edit the seed or add one below.
          </div>
        )}
        {items.map((it, idx) => {
          const key = it.key ?? `idx-${idx}`;
          const data = (it.data ?? it) as Record<string, unknown>;
          const schema = SCHEMAS[tab]?.fields ?? Object.keys(data).map((k) => ({ name: k, label: k }));
          return (
            <div key={key} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50">Item</div>
                  <div className="font-display text-lg">
                    {String((data as Record<string, unknown>).name ?? data.title ?? data.q ?? data.label ?? key)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => remove(tab, key)}
                    disabled={busy === `del:${tab}:${key}`}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-rose-500/20 text-white/70 hover:text-rose-200 border border-white/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {schema.map((f) => (
                  <Field
                    key={f.name}
                    name={f.name}
                    label={f.label}
                    type={f.type}
                    options={f.options}
                    value={String((data as Record<string, unknown>)[f.name] ?? "")}
                    onChange={(v) => {
                      const next = { ...data, [f.name]: v };
                      setDraft((d) => ({ ...d, [`${tab}:${key}`]: stringifyAll(next) }));
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <NeonButton
                  size="sm"
                  loading={busy === `save:${tab}:${key}`}
                  onClick={async () => {
                    const updated = draft[`${tab}:${key}`]
                      ? parseAll(draft[`${tab}:${key}`])
                      : data;
                    await save(tab, key, updated);
                  }}
                >
                  <Save className="h-4 w-4" /> Save
                </NeonButton>
              </div>
            </div>
          );
        })}

        <NewItemForm
          kind={tab}
          schema={SCHEMAS[tab]?.fields ?? []}
          onCreate={async (data) => {
            const key = String(data.name ?? data.title ?? data.q ?? `item-${Date.now()}`)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-");
            await save(tab, key, data);
            window.location.reload();
          }}
        />
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  type,
  options,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "long" | "number" | "url" | "select";
  options?: string[];
}) {
  if (type === "long") {
    return (
      <label className="grid gap-1">
        <span className="text-xs text-white/60">{label}</span>
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-neon-cyan/60"
        />
      </label>
    );
  }
  if (type === "select" && options) {
    return (
      <label className="grid gap-1">
        <span className="text-xs text-white/60">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-neon-cyan/60"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-space-900">
              {o}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <label className="grid gap-1">
      <span className="text-xs text-white/60">{label}</span>
      <input
        type={type === "number" ? "number" : type === "url" ? "url" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-md bg-white/[0.04] border border-white/10 text-sm outline-none focus:border-neon-cyan/60"
      />
      <input type="hidden" value={name} />
    </label>
  );
}

function NewItemForm({
  kind,
  schema,
  onCreate,
}: {
  kind: string;
  schema: { name: string; label: string; type?: "text" | "long" | "number" | "url" | "select"; options?: string[] }[];
  onCreate: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <div className="glass grain rounded-2xl p-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 text-sm text-neon-cyan hover:text-white"
        >
          <Plus className="h-4 w-4" /> New {kind.replace("_", " ")} item
        </button>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {schema.map((f) => (
            <Field
              key={f.name}
              name={f.name}
              label={f.label}
              type={f.type}
              options={f.options}
              value={values[f.name] ?? ""}
              onChange={(v) => setValues((s) => ({ ...s, [f.name]: v }))}
            />
          ))}
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.06] border border-white/10"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
            <NeonButton
              size="sm"
              onClick={async () => {
                const data: Record<string, unknown> = {};
                for (const f of schema) {
                  const v = values[f.name];
                  if (v == null || v === "") continue;
                  if (f.type === "number") data[f.name] = Number(v);
                  else if (f.name === "members") data[f.name] = v.split(",").map((s) => s.trim()).filter(Boolean);
                  else data[f.name] = v;
                }
                await onCreate(data);
              }}
            >
              <Plus className="h-4 w-4" /> Create
            </NeonButton>
          </div>
        </div>
      )}
    </div>
  );
}

function stringifyAll(data: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const k of Object.keys(data)) {
    const v = data[k];
    if (v == null) out[k] = "";
    else if (typeof v === "object") out[k] = JSON.stringify(v);
    else out[k] = String(v);
  }
  return out;
}

function parseAll(values: Record<string, string>) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(values)) {
    const v = values[k];
    if (v === "") continue;
    if (typeof v === "string" && v.startsWith("[") && v.endsWith("]")) {
      try { out[k] = JSON.parse(v); continue; } catch {}
    }
    out[k] = v;
  }
  return out;
}
