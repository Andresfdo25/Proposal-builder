import type { Proposal } from "../lib/sanitize";
import { Section, Row, TextInput } from "./UI";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// Pure local-date <-> string helpers (avoid timezone shifts)
function toISODateLocal(d?: Date): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromISODateLocal(s?: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export default function CompanyProjectForm({
  proposal,
  onChange,
}: {
  proposal: Proposal;
  onChange: (p: Proposal) => void;
}) {
  const company = proposal.company || {};
  const project = proposal.project || {};

  const setCompany = (patch: Partial<Proposal["company"]>) =>
    onChange({ ...proposal, company: { ...company, ...patch } });

  const setProject = (patch: Partial<Proposal["project"]>) =>
    onChange({ ...proposal, project: { ...project, ...patch } });

  const selectedDay = fromISODateLocal(project.bidDate);

  return (
    <div className="space-y-6">
      <Section title="Company">
        <Row cols={3}>
          <TextInput label="Company Name" value={company.name || ""} onChange={(v) => setCompany({ name: v })} />
          <TextInput label="Phone" value={company.phone || ""} onChange={(v) => setCompany({ phone: v })} />
          <TextInput label="Email" value={company.email || ""} onChange={(v) => setCompany({ email: v })} />
        </Row>
        <Row cols={3}>
          <TextInput label="Website" value={company.website || ""} onChange={(v) => setCompany({ website: v })} />
          <TextInput label="Contact" value={company.contact || ""} onChange={(v) => setCompany({ contact: v })} />
          <TextInput label="Address" value={company.address || ""} onChange={(v) => setCompany({ address: v })} />
        </Row>
      </Section>

      <Section title="Project">
        <Row cols={3}>
          <TextInput label="Project Name" value={project.name || ""} onChange={(v) => setProject({ name: v })} />
          <TextInput label="Project Number" value={project.number || ""} onChange={(v) => setProject({ number: v })} />
          <TextInput label="Location" value={project.location || ""} onChange={(v) => setProject({ location: v })} />
        </Row>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="text-sm font-medium mb-1">Bid Date (calendar)</div>
            <div className="rounded-md border border-gray-200 p-2 bg-white">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={(d) => setProject({ bidDate: toISODateLocal(d || undefined) })}
                weekStartsOn={1}
                captionLayout="dropdown"
                // Restrict year dropdown a bit (optional)
                fromYear={2020}
                toYear={2030}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <TextInput
              label="Bid Date (YYYY-MM-DD)"
              value={project.bidDate || ""}
              onChange={(v) => setProject({ bidDate: v })}
              hint="You can type a date directly or pick one in the calendar."
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

