import { useMemo, useState } from "react";
import { DEFAULT_PROPOSAL, sanitizeScope, type Proposal, type Scope } from "./lib/sanitize";
import ScopeEditor from "./components/ScopeEditor";
import PreviewDoc from "./components/PreviewDoc";
import { Button } from "./components/UI";

const seedScope: Scope = sanitizeScope({
  trade: "Storefront",
  title: "Main Entry Storefront",
  system: "YKK 60TU (basis) / Kawneer 451T (alt)",
  finish: "Anodized Dark Bronze",
  inclusions: ["Shop drawings & submittals", "Perimeter seals within our scope"],
  exclusions: ["Electrical for access control", "Painting/patching by others"],
  pricingItems: [{ id: "p1", description: `1" IGU Low-E glazing`, unit: "SF", qty: 100, unitRate: 25 }],
  services: [{ id: "s1", description: "Field measure & layout", unit: "LS", qty: 1, unitRate: 350 }],
  generalConditions: [{ id: "g1", description: "Safety & PPE", unit: "LS", qty: 1, unitRate: 150 }],
  alternates: [{ id: "a1", label: "Alt 1", description: "Upgrade to SGP interlayer", addOrDeduct: "ADD", amount: 900 }],
});

export default function App() {
  const [activeTab, setActiveTab] = useState<"build" | "preview">("build");
  const [proposal, setProposal] = useState<Proposal>(() => ({
    ...DEFAULT_PROPOSAL,
    name: "Maple Ridge Office Renovation",
    company: { ...DEFAULT_PROPOSAL.company, name: "Del Ray Glass", phone: "(703) 555-0123", email: "estimating@delrayglass.com" },
    project: { name: "Maple Ridge Office", number: "MR-042", location: "Arlington, VA", bidDate: "2025-08-20" },
    scopes: [seedScope],
  }));

  const activeScope = useMemo(() => proposal.scopes[0], [proposal]);

  const updateScope = (idx: number, patch: Scope) => {
    const scopes = proposal.scopes.slice();
    scopes[idx] = patch;
    setProposal({ ...proposal, scopes });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Proposal Builder</h1>
        <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
          <button
            className={`px-4 py-2 text-sm ${activeTab === "build" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setActiveTab("build")}
          >
            Builder
          </button>
          <button
            className={`px-4 py-2 text-sm ${activeTab === "preview" ? "bg-gray-100" : "bg-white"}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
      </header>

      {activeTab === "build" ? (
        <>
          <div className="mb-4">
            <div className="text-sm text-gray-600">
              Project: <strong>{proposal.project.name}</strong> • Bid Date: <strong>{proposal.project.bidDate || "—"}</strong>
            </div>
          </div>
          <ScopeEditor scope={activeScope} onChange={(s) => updateScope(0, s)} />
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <PreviewDoc proposal={proposal} />
        </div>
      )}

      <footer className="mt-8 flex gap-2">
        <Button onClick={() => setActiveTab(activeTab === "build" ? "preview" : "build")}>
          {activeTab === "build" ? "Go to Preview" : "Back to Builder"}
        </Button>
      </footer>
    </div>
  );
}
