import type { Scope, LineItem, Alternate } from "../lib/sanitize";
import { Section, Row, TextInput, TextArea, NumberInput, Select, Button, Divider } from "./UI";
import LinesTable from "./LinesTable";

const TRADE_OPTIONS = [
  "Glass & Glazing",
  "Storefront",
  "Curtain Wall",
  "Window Wall",
  "All-Glass Entrances",
  "Doors & Hardware",
  "Metal Panels",
  "Service",
  "General Conditions",
].map((t) => ({ label: t, value: t }));

type Props = {
  scope: Scope;
  onChange: (scope: Scope) => void;
  currency: string;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export default function ScopeEditor({ scope, onChange, currency }: Props) {
  const update = (patch: Partial<Scope>) => onChange({ ...scope, ...patch });

  const updateArrayText = (key: "inclusions" | "exclusions", v: string) =>
    update({ [key]: v.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) } as any);

  const updateLines = (key: "pricingItems" | "services" | "generalConditions", items: LineItem[]) =>
    update({ [key]: items } as any);

  const updateAlts = (items: Alternate[]) => update({ alternates: items });

  // safe defaults
  const inclusions = (scope.inclusions || []).join("\n");
  const exclusions = (scope.exclusions || []).join("\n");

  return (
    <div className="space-y-6">
      <Section title="Identity">
        <Row cols={3}>
          <Select
            label="Trade"
            value={scope.trade}
            onChange={(v) => update({ trade: v })}
            options={TRADE_OPTIONS}
          />
          <TextInput label="Scope Title" value={scope.title} onChange={(v) => update({ title: v })} />
          <TextInput label="System" value={scope.system} onChange={(v) => update({ system: v })} />
        </Row>
        <Row cols={3}>
          <TextInput label="Finish" value={scope.finish} onChange={(v) => update({ finish: v })} />
          <TextInput label="Glass Spec" value={scope.glassSpec || ""} onChange={(v) => update({ glassSpec: v })} />
          <TextInput
            label="Notes"
            value={scope.notes || ""}
            onChange={(v) => update({ notes: v })}
            placeholder="Any specific remarks for this scope"
          />
        </Row>
      </Section>

      <Section title="Performance & Structural">
        <Row cols={4}>
          <TextInput
            label="U-Value"
            value={scope.performance?.uValue || ""}
            onChange={(v) => update({ performance: { ...(scope.performance || {}), uValue: v } })}
          />
          <TextInput
            label="SHGC"
            value={scope.performance?.shgc || ""}
            onChange={(v) => update({ performance: { ...(scope.performance || {}), shgc: v } })}
          />
          <TextInput
            label="Visible Transmittance"
            value={scope.performance?.vt || ""}
            onChange={(v) => update({ performance: { ...(scope.performance || {}), vt: v } })}
          />
          <TextInput
            label="Air Infiltration"
            value={scope.performance?.airInfiltration || ""}
            onChange={(v) => update({ performance: { ...(scope.performance || {}), airInfiltration: v } })}
          />
        </Row>
        <Row cols={2}>
          <TextInput
            label="Design PSF"
            value={scope.structural?.designPSF || ""}
            onChange={(v) => update({ structural: { ...(scope.structural || {}), designPSF: v } })}
          />
          <TextInput
            label="Deflection Limit"
            value={scope.structural?.deflectionLimit || ""}
            onChange={(v) => update({ structural: { ...(scope.structural || {}), deflectionLimit: v } })}
          />
        </Row>
      </Section>

      <Section title="Scope Text">
        <Row cols={2}>
          <TextArea
            label="Inclusions (one per line)"
            value={inclusions}
            onChange={(v) => updateArrayText("inclusions", v)}
            rows={6}
          />
          <TextArea
            label="Exclusions (one per line)"
            value={exclusions}
            onChange={(v) => updateArrayText("exclusions", v)}
            rows={6}
          />
        </Row>
      </Section>

      <Section title="Pricing">
        <LinesTable
          title="Direct Pricing Items"
          items={scope.pricingItems || []}
          onChange={(items) => updateLines("pricingItems", items)}
          currency={currency}
        />
        <Divider />
        <LinesTable
          title="Service"
          items={scope.services || []}
          onChange={(items) => updateLines("services", items)}
          currency={currency}
        />
        <Divider />
        <LinesTable
          title="General Conditions"
          items={scope.generalConditions || []}
          onChange={(items) => updateLines("generalConditions", items)}
          currency={currency}
        />
      </Section>

      <Section title="Alternates">
        <AlternatesEditor items={scope.alternates || []} onChange={updateAlts} />
      </Section>
    </div>
  );
}

function AlternatesEditor({
  items,
  onChange,
}: {
  items: Alternate[];
  onChange: (items: Alternate[]) => void;
}) {
  const add = () =>
    onChange([
      ...items,
      { id: uid(), label: "Alt", description: "", addOrDeduct: "ADD", amount: 0 },
    ]);

  const remove = (id: string) => onChange(items.filter((x) => x.id !== id));

  const update = (id: string, patch: Partial<Alternate>) =>
    onChange(items.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-3">
      {(items || []).map((a) => (
        <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-2">
            <TextInput label="Label" value={a.label} onChange={(v) => update(a.id, { label: v })} />
          </div>
          <div className="md:col-span-6">
            <TextInput
              label="Description"
              value={a.description}
              onChange={(v) => update(a.id, { description: v })}
            />
          </div>
          <div className="md:col-span-2">
            <Select
              label="Type"
              value={a.addOrDeduct}
              onChange={(v) => update(a.id, { addOrDeduct: v as "ADD" | "DEDUCT" })}
              options={[
                { label: "ADD", value: "ADD" },
                { label: "DEDUCT", value: "DEDUCT" },
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <NumberInput
              label="Amount"
              value={a.amount}
              onChange={(v) => update(a.id, { amount: v })}
              step={0.01}
              min={0}
            />
          </div>
          <div className="md:col-span-12">
            <Button variant="ghost" onClick={() => remove(a.id)}>Remove</Button>
          </div>
        </div>
      ))}
      <Button onClick={add}>+ Add alternate</Button>
    </div>
  );
}
