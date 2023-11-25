import { FieldError, FieldValues, UseFormRegister } from "react-hook-form";
import { ProfileFormType } from "~/types";

export default function InputComponent({
  label,
  registerName,
  error,
  register,
  inputInfo,
}: {
  label: string;
  registerName: any;
  error: FieldError | undefined;
  register: UseFormRegister<any>;
  inputInfo?: string;
}) {
  return (
    <div className="col-span-1 flex flex-col">
      <label
        htmlFor=""
        className={`${error ? "text-red-500" : null} mb-1 text-xs font-medium`}
      >
        {label}
      </label>
      <input
        {...register(registerName)}
        type="text"
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
