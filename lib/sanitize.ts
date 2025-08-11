// Core types and safe normalizers for Proposal Builder

export type LineItem = {
  id: string;
  description: string;
  unit: string;
  qty: number;
  unitRate: number;
};

export type Alternate = {
  id: string;
  label: string;
  description: string;
  addOrDeduct: "ADD" | "DEDUCT";
  amount: number;
};

export type Scope = {
  id: string;
  trade: string;
  title: string;
  system: string;
  finish: string;
  glassSpec?: string;
  performance?: { uValue?: string; shgc?: string; vt?: string; airInfiltration?: string };
  structural?: { designPSF?: string; deflectionLimit?: string };
  inclusions: string[];
  exclusions: string[];
  notes?: string;
  schedule?: Record<string, string>;
  pricingItems: LineItem[];
  services: LineItem[];
  generalConditions: LineItem[];
  alternates: Alternate[];
};

export type Proposal = {
  id: string;
  name: string;
  version: string;
  company: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    contact?: string;
    logoDataUrl?: string;
  };
  client: { name?: string; contact?: string; email?: string; phone?: string; address?: string };
  project: { name?: string; number?: string; location?: string; bidDate?: string };
  commercialTerms: {
    taxRatePct: number;
    overheadPct: number;
    profitPct: number;
    bondPct: number;
    currency: string;
    showUnitRates: boolean;
    showBreakdown: boolean;
    includeBond: boolean;
    paymentTerms: string;
    warranty: string;
  };
  scopes: Scope[];
  disclaimers: string[];
  createdAt: string;
  updatedAt: string;
};

export const TRADE_PRESETS = [
  "Glass & Glazing",
  "Storefront",
  "Curtain Wall",
  "Window Wall",
  "All-Glass Entrances",
  "Doors & Hardware",
  "Metal Panels",
  "Service",
  "General Conditions",
] as const;

// robust id generator (works even if crypto is not available)
const newId = () =>
  (globalThis as any)?.crypto?.randomUUID
    ? (globalThis as any).crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const COMPANY_DEFAULT = {
  name: "Del Ray Glass",
  address: "",
  phone: "",
  email: "",
  website: "",
  contact: "",
  logoDataUrl: "",
};

export const DEFAULT_PROPOSAL: Proposal = {
  id: newId(),
  name: "Untitled Proposal",
  version: "1.0",
  company: COMPANY_DEFAULT,
  client: { name: "", contact: "", email: "", phone: "", address: "" },
  project: { name: "", number: "", location: "", bidDate: "" },
  commercialTerms: {
    taxRatePct: 0,
    overheadPct: 10,
    profitPct: 10,
    bondPct: 0,
    currency: "USD",
    showUnitRates: true,
    showBreakdown: true,
    includeBond: false,
    paymentTerms: "Net 30 days from invoice; progress billing monthly.",
    warranty: "Manufacturer’s standard; 2 years workmanship.",
  },
  scopes: [],
  disclaimers: [
    "Excludes permits, utilities relocation, and unforeseen conditions unless noted.",
    "Excludes structural engineering unless specifically included.",
    "Price valid 30 days; lead times subject to approved submittals and vendor confirmation.",
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ---------- helpers ----------
const toStrArray = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.filter((x) => typeof x === "string") as string[];
  if (typeof v === "string") return v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return [];
};

const toLineArray = (arr: unknown): LineItem[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map((x: any) => ({
    id: x?.id || newId(),
    description: String(x?.description ?? ""),
    unit: String(x?.unit ?? "LS"),
    qty: Number.isFinite(+x?.qty) ? +x.qty : 1,
    unitRate: Number.isFinite(+x?.unitRate) ? +x.unitRate : 0,
  }));
};

const toAltsArray = (arr: unknown): Alternate[] => {
  if (!Array.isArray(arr)) return [];
  return arr.map((a: any) => ({
    id: a?.id || newId(),
    label: String(a?.label ?? "Alt #"),
    description: String(a?.description ?? ""),
    addOrDeduct: a?.addOrDeduct === "DEDUCT" ? "DEDUCT" : "ADD",
    amount: Number.isFinite(+a?.amount) ? +a.amount : 0,
  }));
};

export function sanitizeScope(s: any): Scope {
  const trade = (TRADE_PRESETS as readonly string[]).includes(s?.trade) ? s.trade : "Storefront";
  return {
    id: s?.id || newId(),
    trade,
    title: String(s?.title ?? `${trade} Scope`),
    system: String(s?.system ?? ""),
    finish: String(s?.finish ?? ""),
    glassSpec: String(s?.glassSpec ?? ""),
    performance: typeof s?.performance === "object" && s?.performance !== null ? s.performance : {},
    structural: typeof s?.structural === "object" && s?.structural !== null ? s.structural : {},
    inclusions: toStrArray(s?.inclusions),
    exclusions: toStrArray(s?.exclusions),
    notes: String(s?.notes ?? ""),
    schedule: typeof s?.schedule === "object" && s?.schedule !== null ? s.schedule : {},
    pricingItems: toLineArray(s?.pricingItems),
    services: toLineArray(s?.services),
    generalConditions: toLineArray(s?.generalConditions),
    alternates: toAltsArray(s?.alternates),
  };
}

export function sanitizeProposal(p: any): Proposal {
  const cp: Proposal = { ...DEFAULT_PROPOSAL, ...(p || {}) } as Proposal;
  cp.id = cp.id || newId();
  cp.company = { ...DEFAULT_PROPOSAL.company, ...(cp.company || {}) };
  cp.client = { ...DEFAULT_PROPOSAL.client, ...(cp.client || {}) };
  cp.project = { ...DEFAULT_PROPOSAL.project, ...(cp.project || {}) };
  cp.commercialTerms = { ...DEFAULT_PROPOSAL.commercialTerms, ...(cp.commercialTerms || {}) };
  cp.disclaimers = toStrArray(cp.disclaimers);
  cp.scopes = Array.isArray(cp.scopes) ? cp.scopes.map(sanitizeScope) : [];
  cp.createdAt = cp.createdAt || new Date().toISOString();
  cp.updatedAt = cp.updatedAt || new Date().toISOString();
  return cp;
}
