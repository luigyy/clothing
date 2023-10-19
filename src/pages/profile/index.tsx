import { execFile } from "child_process";
import React from "react";

function InputComponent({ label }: { label: string }) {
  return (
    <div className="col-span-1 flex flex-col">
      <label htmlFor="" className="text-sm text-orange">
        {label}
      </label>
      <input
        type="text"
        placeholder={label}
        className="rounded border border-blue border-opacity-25 bg-creme px-2 py-1 text-sm outline-none placeholder:text-sm "
      />
    </div>
  );
}

function SelectComponent() {
  return (
    <div className="flex flex-col">
      <label htmlFor="countries" className=" text-sm text-orange">
        Provincia
      </label>
      <select
        id="countries"
        className="rounded border border-blue border-opacity-25 bg-creme px-2 py-1 text-sm outline-none placeholder:text-sm"
      >
        <option selected>Choose a country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="FR">France</option>
        <option value="DE">Germany</option>
      </select>
    </div>
  );
}

const Index = ({}) => {
  return (
    <div className="grid grid-cols-3 gap-x-5 gap-y-2  px-32">
      <InputComponent label="Nombre" />
      <InputComponent label="Nombre" />
      <InputComponent label="Nombre" />
      <InputComponent label="Nombre" />
      <SelectComponent />
    </div>
  );
};

export default Index;
