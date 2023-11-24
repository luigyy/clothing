import { data } from "./data";
import { useEffect, useState } from "react";

function App() {
  const [provinces, setProvinces] = useState(Object.keys(data));
  const [municipalities, setMunicipalities] = useState<string[] | null>(null);

  //selections
  const [provinceSelected, setProvinceSelected] = useState<string | null>();
  const [municipalitySelected, setMunicipalitySelected] = useState<
    string | null
  >();

  useEffect(() => {
    console.log(provinceSelected);
    // @ts-ignore
    setMunicipalities(data[provinceSelected]);
    console.log(municipalities);
  }, [provinceSelected]);
  //
  //
  return (
    <div className="mx-auto w-96 p-10">
      <SelectComponent options={provinces} handleFn={setProvinceSelected} />
      <SelectComponent
        options={municipalities || []}
        handleFn={setMunicipalitySelected}
      />
    </div>
  );
}

function SelectComponent({
  options,
  handleFn,
}: {
  options: string[];
  handleFn: (value: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium tracking-tight">
        Provincia
      </label>
      <select
        onChange={(e) => handleFn(e.target.value)}
        className=" rounded border border-zinc-200 bg-transparent p-1 outline-none"
      >
        {options.map((option) => (
          <option value={option} className="border-zinc-200">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
