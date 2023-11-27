import { FieldError, useFormContext } from "react-hook-form";

export default function InputComponent({
  label,
  registerName,
  inputInfo,
  error,
  type,
}: {
  label: string;
  registerName: string;
  inputInfo?: string;
  error: FieldError | undefined;
  type: "text" | "number";
}) {
  const { register } = useFormContext();
  return (
    <div className="col-span-1 flex flex-col">
      <label
        className={`${error ? "text-red-500" : null} mb-1 text-xs font-medium`}
      >
        {label}
      </label>
      <input
        {...register(registerName, { valueAsNumber: type === "number" })}
        type={type}
        placeholder={label}
        className={`rounded border
        border-blue border-opacity-10 bg-creme px-2 py-2 text-sm shadow-sm outline-none  placeholder:text-sm placeholder:tracking-tight `}
      />
      <p className="pt-1 text-xs text-blue/40  ">{inputInfo}</p>
      {error ? (
        <p className="ml-1 text-xs text-red-500">{error.message}</p>
      ) : null}
    </div>
  );
}
