import type { FieldError } from "react-hook-form";

export default function FieldError({ error }: { error?: FieldError }) {
  if (!error) return null;

  return <p className="mt-1 text-sm text-red-500">{error.message}</p>;
}
