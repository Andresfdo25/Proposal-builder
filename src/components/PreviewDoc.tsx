import type { Proposal } from "../lib/sanitize";
import { currencyFmt, useTotals } from "../lib/totals";

export default function PreviewDoc({ proposal }: { proposal: Proposal }) {
  const t = useTotals(proposal);
  const company = proposal.company || {};
  const proj = proposal.project || {};

  return (
    <div className="prose max-w-none">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="m-0">{proposal.name || "Proposal"}</h1>
          <p className="m-0 text-sm">
            <strong>Project No.:</strong> {proj.number || "—"}<br />
            <strong>Location:</strong> {proj.location || "—"}<br />
            <strong>Bid Date:</strong> {proj.bidDate || "—"}
          </p>
        </div>
        <div className="text-right">
          <div className="font-semibold">{company.name || "Company"}</div>
          <div className="text-sm">{company.address}</div>
          <div className="text-sm">{company.phone}</div>
          <div className="text-sm">{company.email}</div>
          <div className="text-sm">{company.website}</div>
        </div>
      </header>

      <hr />

      {proposal.scopes.map((s, idx) => (
        <section key={s.id} className="mb-6">
          <h2 className="m-0">
            {idx + 1}. {s.title || s.trade}
            {" "}
            <small className="text-gray-500">({s.trade})</small>
          </h2>
          <p className="m-0 text-sm">
            <strong>System:</strong> {s.system || "—"} • <strong>Finish:</strong> {s.finish || "—"}
            {s.glassSpec ? <> • <strong>Glass:</strong> {s.glassSpec}</> : null}
          </p>

          {(s.inclusions?.length || 0) > 0 && (
            <>
              <h4>Inclusions</h4>
              <ul className="mt-1">
                {s.inclusions!.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </>
          )}
          {(s.exclusions?.length || 0) > 0 && (
            <>
              <h4>Exclusions</h4>
              <ul className="mt-1">
                {s.exclusions!.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </>
          )}
        </section>
      ))}

      <section>
        <h2>Commercial Summary</h2>
        <table>
          <tbody>
            <tr><td>Direct Total</td><td className="text-right">{currencyFmt(t.directTotal, proposal.commercialTerms.currency)}</td></tr>
            <tr><td>Overhead ({proposal.commercialTerms.overheadPct}%)</td><td className="text-right">{currencyFmt(t.overhead, proposal.commercialTerms.currency)}</td></tr>
            <tr><td>Profit ({proposal.commercialTerms.profitPct}%)</td><td className="text-right">{currencyFmt(t.profit, proposal.commercialTerms.currency)}</td></tr>
            {proposal.commercialTerms.includeBond && (
              <tr><td>Bond ({proposal.commercialTerms.bondPct}%)</td><td className="text-right">{currencyFmt(t.bond, proposal.commercialTerms.currency)}</td></tr>
            )}
            <tr><td>Tax ({proposal.commercialTerms.taxRatePct}%)</td><td className="text-right">{currencyFmt(t.tax, proposal.commercialTerms.currency)}</td></tr>
            <tr><td><strong>Grand Total</strong></td><td className="text-right"><strong>{currencyFmt(t.grandTotal, proposal.commercialTerms.currency)}</strong></td></tr>
          </tbody>
        </table>
      </section>

      {proposal.disclaimers?.length ? (
        <section>
          <h3>Notes / Disclaimers</h3>
          <ul>
            {proposal.disclaimers.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
