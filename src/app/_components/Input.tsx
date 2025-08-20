import type { RefCallback, RefObject } from "react";

export default function Input({
  ref,
  ...props
}: {
  ref?: RefObject<HTMLInputElement | null> | RefCallback<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      ref={ref}
      {...props}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
    />
  );
}
