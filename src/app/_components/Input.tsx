export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
    />
  );
}
