import type { PropsWithChildren } from "react";

export function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="rounded-lg border border-gray-200 p-4 bg-white">{children}</div>
    </section>
  );
}

export function Row({ cols = 2, children }: PropsWithChildren<{ cols?: 1 | 2 | 3 | 4 }>) {
  const cls = {
    1: "grid grid-cols-1 gap-4",
    2: "grid grid-cols-1 md:grid-cols-2 gap-4",
    3: "grid grid-cols-1 md:grid-cols-3 gap-4",
    4: "grid grid-cols-1 md:grid-cols-4 gap-4",
  }[cols];
  return <div className={cls}>{children}</div>;
}

type BaseProps = { label?: string; className?: string; hint?: string };

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  className,
  hint,
}: BaseProps & { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className={`block ${className || ""}`}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  className,
  hint,
}: BaseProps & { value: number; onChange: (v: number) => void; step?: number; min?: number }) {
  return (
    <label className={`block ${className || ""}`}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  className,
  hint,
  placeholder,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className={`block ${className || ""}`}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  className,
  hint,
}: BaseProps & {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className={`block ${className || ""}`}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </label>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
}>) {
  const base = "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost: "border border-gray-300 text-gray-800 hover:bg-gray-50",
  } as const;
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className || ""}`}>
      {children}
    </button>
  );
}

export function Divider() {
  return <hr className="my-4 border-gray-200" />;
}
