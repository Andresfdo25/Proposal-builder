import { NumberInput, TextInput, Button } from "./UI";
import type { LineItem } from "../lib/sanitize";
import { currencyFmt } from "../lib/totals";

const uid = () => Math.random().toString(36).slice(2, 10);

type Props = {
  title?: string;
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  showTotals?: boolean;
  currency?: string;
};

const lineTotal = (it: LineItem) =>
  (Number(it.qty) || 0) * (Number(it.unitRate) || 0);

export default function LinesTable({
  title,
  items,
  onChange,
  showTotals = true,
  currency = "USD",
}: Props) {
  const safeItems = items || [];

  const add = () =>
    onChange([
      ...safeItems,
      { id: uid(), description: "", unit: "LS", qty: 1, unitRate: 0 },
    ]);

  const remove = (id: string) =>
    onChange(safeItems.filter((x) => x.id !== id));

  const update = (id: string, patch: Partial<LineItem>) =>
    onChange(safeItems.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const sum = safeItems.reduce((s, it) => s + lineTotal(it), 0);

  return (
    <div>
      {title && <div className="font-medium mb-2">{title}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-semibold px-3 py-2 border-b">
                Description
              </th>
              <th className="text-left text-xs font-semibold px-3 py-2 border-b w-24">
                Unit
              </th>
              <th className="text-right text-xs font-semibold px-3 py-2 border-b w-24">
                Qty
              </th>
              <th className="text-right text-xs font-semibold px-3 py-2 border-b w-32">
                Unit Rate
              </th>
              <th className="text-right text-xs font-semibold px-3 py-2 border-b w-32">
                Total
              </th>
              <th className="w-16 border-b"></th>
            </tr>
          </thead>

          <tbody>
            {safeItems.map((it) => (
              <tr key={it.id} className="odd:bg-white even:bg-gray-50">
                <td className="px-3 py-2 align-top">
                  <TextInput
                    value={it.description}
                    onChange={(v: string) => update(it.id, { description: v })}
                    placeholder={`e.g., 1" IGU Low-E glazing`}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <TextInput
                    value={it.unit}
                    onChange={(v: string) => update(it.id, { unit: v })}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <NumberInput
                    value={it.qty}
                    onChange={(v: number) => update(it.id, { qty: v })}
                    step={0.01}
                    min={0}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <NumberInput
                    value={it.unitRate}
                    onChange={(v: number) => update(it.id, { unitRate: v })}
                    step={0.01}
                    min={0}
                  />
                </td>
                <td className="px-3 py-2 align-top text-right tabular-nums">
                  {currencyFmt(lineTotal(it), currency)}
                </td>
                <td className="px-3 py-2 align-top text-right">
                  <Button variant="ghost" onClick={() => remove(it.id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}

            <tr>
              <td colSpan={6} className="px-3 py-2">
                <Button onClick={add}>+ Add line</Button>
              </td>
            </tr>
          </tbody>

          {showTotals && (
            <tfoot>
              <tr className="bg-gray-50">
                <td className="px-3 py-2 text-right font-semibold" colSpan={4}>
                  Subtotal
                </td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">
                  {currencyFmt(sum, currency)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
