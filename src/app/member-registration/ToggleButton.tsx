import { useFormContext } from "react-hook-form";

export default function ToggleButton({
  fieldName,
  children,
  ...inputProps
}: {
  fieldName: Parameters<ReturnType<typeof useFormContext>["register"]>[0];
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { watch } = useFormContext();
  const fieldValue = watch(fieldName);

  return (
    <>
      <input type="radio" className="hidden" {...inputProps} />
      <label
        htmlFor={inputProps.id}
        className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
          fieldValue === inputProps.value ? "bg-yellow-500" : ""
        }`}
      >
        {children}
      </label>
    </>
  );
}
