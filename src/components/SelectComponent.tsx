import { Controller, useFormContext } from "react-hook-form";

export default function SelectComponent({
  label,
  options,
  registerName,
}: {
  label: string;
  options: readonly string[];
  registerName: string;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      defaultValue={options[0]}
      name={registerName}
      render={({ field: { onChange, value, name, ref } }) => (
        <div className="span-1 -pt-1 flex flex-col">
          <label htmlFor="countries" className=" pb-1 text-xs font-medium">
            {label}
          </label>
          <select
            onChange={(val) => onChange(val)}
            id="countries"
            className={`rounded
           border border-blue
          border-opacity-10 bg-creme p-2 text-sm shadow-sm outline-none placeholder:text-sm`}
          >
            {options.map((option) => (
              <option value={option} disabled={options.length === 0}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    />
  );
}
