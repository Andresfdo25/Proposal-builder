import { describe, it, expect } from "vitest";
import { calcScopeTotals } from "../totals";
import type { Scope } from "../sanitize";

describe("calcScopeTotals", () => {
  const base: Omit<Scope, "pricingItems" | "services" | "generalConditions" | "alternates"> = {
    id: "s1",
    trade: "Storefront",
    title: "Test Scope",
    system: "Sys",
    finish: "Finish",
    inclusions: [],
    exclusions: [],
  };

  it("adds and deducts alternates", () => {
    const scope: Scope = {
      ...base,
      pricingItems: [{ id: "p1", description: "Item", unit: "EA", qty: 1, unitRate: 100 }],
      services: [],
      generalConditions: [],
      alternates: [
        { id: "a1", label: "Add", description: "", addOrDeduct: "ADD", amount: 100 },
        { id: "a2", label: "Deduct", description: "", addOrDeduct: "DEDUCT", amount: 40 },
      ],
    };

    const totals = calcScopeTotals(scope);
    expect(totals.alternates).toBe(60);
    expect(totals.subtotal).toBe(160);
  });

  it("handles net negative alternates", () => {
    const scope: Scope = {
      ...base,
      pricingItems: [{ id: "p1", description: "Item", unit: "EA", qty: 1, unitRate: 100 }],
      services: [],
      generalConditions: [],
      alternates: [
        { id: "a1", label: "Add", description: "", addOrDeduct: "ADD", amount: 50 },
        { id: "a2", label: "Deduct", description: "", addOrDeduct: "DEDUCT", amount: 80 },
      ],
    };

    const totals = calcScopeTotals(scope);
    expect(totals.alternates).toBe(-30);
    expect(totals.subtotal).toBe(70);
  });
});

