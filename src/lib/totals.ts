import type { Proposal, Scope } from "./sanitize";
import { useMemo } from "react";

export const currencyFmt = (n: number, currency = "USD") => {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n || 0);
  try {
    return sign + new Intl.NumberFormat("en-US", { style: "currency", currency }).format(v);
  } catch {
    return sign + `$${v.toFixed(2)}`;
  }
};

export const lineSum = (it: { qty: number; unitRate: number }) =>
  (Number(it.qty) || 0) * (Number(it.unitRate) || 0);

export function calcScopeTotals(scope: Scope) {
  const directPricing = (scope.pricingItems || []).reduce((s, it) => s + lineSum(it), 0);
  const services = (scope.services || []).reduce((s, it) => s + lineSum(it), 0);
  const genConds = (scope.generalConditions || []).reduce((s, it) => s + lineSum(it), 0);
  const direct = directPricing + services + genConds;
  const alternates = (scope.alternates || []).reduce(
    (s, a) => s + (a.addOrDeduct === "DEDUCT" ? -1 : 1) * (Number(a.amount) || 0),
    0
  );
  return { directPricing, services, genConds, direct, alternates, subtotal: direct + alternates };
}

export function useTotals(proposal: Proposal) {
  return useMemo(() => {
    const scopes = proposal.scopes || [];
    const byScope = scopes.map((s) => ({ id: s.id, ...calcScopeTotals(s) }));
    const directTotal = byScope.reduce((s, t) => s + t.direct, 0);
    const alternatesTotal = byScope.reduce((s, t) => s + t.alternates, 0);

    const overhead = (proposal.commercialTerms.overheadPct / 100) * directTotal;
    const profitBase = directTotal + overhead;
    const profit = (proposal.commercialTerms.profitPct / 100) * profitBase;
    const bond = proposal.commercialTerms.includeBond
      ? (proposal.commercialTerms.bondPct / 100) * (directTotal + overhead + profit)
      : 0;
    const taxable = directTotal + overhead + profit + bond;
    const tax = (proposal.commercialTerms.taxRatePct / 100) * taxable;
    const grandTotal = taxable + tax + alternatesTotal;

    return { byScope, directTotal, alternatesTotal, overhead, profit, bond, tax, grandTotal };
  }, [proposal]);
}
