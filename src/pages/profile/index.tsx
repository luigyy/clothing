import { useSession } from "next-auth/react";

import React, { useState } from "react";
import { PROVINCES_NAMES, PROVINCES_MUNICIPALITIES } from "~/constants";

function InputComponent({
  label,
  updatingProfile,
}: {
  label: string;
  updatingProfile: boolean;
}) {
  return (
    <div className="col-span-1 flex flex-col">
      <label htmlFor="" className="text-sm text-orange">
        {label}
      </label>
      <input
        type="text"
        placeholder={label}
        disabled={!updatingProfile}
        className={`rounded ${
          updatingProfile ? "border border-blue" : "border bg-zinc-50"
        }  border-opacity-25 bg-creme px-2 py-1  text-sm outline-none placeholder:text-sm `}
      />
    </div>
  );
}

function SelectComponent({
  label,
  updatingProfile,
  options,
  handlerFn,
}: {
  label: string;
  updatingProfile: boolean;
  options: string[];
  handlerFn: (label: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor="countries" className=" text-sm text-orange">
        {label}
      </label>
      <select
        id="countries"
        className={`rounded ${
          updatingProfile ? "border border-blue " : "border bg-zinc-50"
        }  border-opacity-25 bg-creme px-2 py-1 text-sm outline-none placeholder:text-sm`}
        onChange={(e) => handlerFn(e.target.value)}
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

const WalletComponent = () => {
  return (
    <div className="relative mx-auto my-16 aspect-[1.9] w-1/2 max-w-[600px] rounded-md border border-blue bg-blue">
      <h1 className="p-2 text-xl text-creme">Monedero virtual</h1>

      <div className="mt-5">
        <h1 className="text-center text-creme">Tu balance es</h1>
        <p className="text-center text-4xl font-bold text-creme">30.000</p>
      </div>

      <div className="absolute bottom-2 flex h-10  w-full gap-x-3 px-2 ">
        <button className="clickable-effect w-1/2 rounded-md bg-creme px-2 py-1 text-blue">
          Historial
        </button>
        <button className="clickable-effect w-1/2 rounded bg-green px-2 py-1">
          Retirar
        </button>
      </div>
    </div>
  );
};

const Index = ({}) => {
  const [provinceOptions, setProvinceOptions] = useState(PROVINCES_NAMES);
  const [municipalitiesOptions, setMunicipalitiesOptions] = useState<
    string[] | null
  >(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  //input handlers
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");

  const img = useSession().data?.user.image;

  return (
    <>
      <img
        src={img || "default-profile-picture.jpg"}
        className="mx-auto h-28 w-28 rounded-full p-4"
        alt=""
      />
      <form className="">
        <div className="grid grid-cols-3 gap-x-5 gap-y-2 px-32">
          <InputComponent label="Nombre" updatingProfile={updatingProfile} />
          <InputComponent label="Apellido" updatingProfile={updatingProfile} />
          <InputComponent label="Teléfono" updatingProfile={updatingProfile} />
          <InputComponent label="Email" updatingProfile={updatingProfile} />

          {/* location  */}
          <InputComponent label="Provincia" updatingProfile={updatingProfile} />
          <InputComponent label="Cantón" updatingProfile={updatingProfile} />
          <InputComponent label="Distrito" updatingProfile={updatingProfile} />

          {/* <SelectComponent
            label="Provincia"
            updatingProfile={updatingProfile}
            options={provinceOptions}
            handlerFn={setProvince}
          /> */}
          {/* <SelectComponent
            label="Cantón"
            updatingProfile={updatingProfile}
            options={municipalitiesOptions || []}
            handlerFn={setMunicipality}
          /> */}
          {/* <SelectComponent label="Distrito" updatingProfile={updatingProfile} /> */}
          <InputComponent
            label="Link de Google Maps"
            updatingProfile={updatingProfile}
          />
          <InputComponent
            label="Dirección exacta"
            updatingProfile={updatingProfile}
          />
        </div>
      </form>

      {updatingProfile ? (
        <div className="mx-32 mt-5 flex gap-x-3">
          <button className="rounded border border-blue border-opacity-25 bg-blue px-2 py-1 text-sm text-creme">
            Guardar cambios
          </button>
          <button
            className="rounded border border-blue border-opacity-25 bg-creme px-2 py-1 text-sm text-blue"
            onClick={() => setUpdatingProfile((prev) => !prev)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          className="mx-32 mt-5 rounded border border-blue border-opacity-25 bg-blue px-2 py-1 text-sm text-creme"
          onClick={() => setUpdatingProfile((prev) => !prev)}
        >
          Editar perfil
        </button>
      )}

      <WalletComponent />
    </>
  );
};

export default Index;
