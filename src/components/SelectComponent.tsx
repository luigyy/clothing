function SelectComponent({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor="countries" className=" text-sm text-orange">
        {label}
      </label>
      <select
        id="countries"
        className={`rounded 
           border border-blue  
          border-opacity-25 bg-creme px-2 py-1 text-sm outline-none placeholder:text-sm`}
      >
        {options.map((option) => (
          <option value={option} disabled={options.length === 0}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
