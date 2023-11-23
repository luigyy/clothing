//TODO: create layout and move input componenets to components folder
import { useSession } from "next-auth/react";
import { PROVINCES_NAMES, PROVINCES_MUNICIPALITIES } from "~/constants";
import React, { useState } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const ProfileFormSchema = z.object({
  name: z.string(),
  lastName: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
  locationLink: z.string(),
  exactLocation: z.string(),
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

const ProfileSettings = () => {
  //useForm stuff
  const { register, handleSubmit, formState } = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
  });

  const { errors } = formState;

  //handlers
  const onSubmit = (formValues: ProfileFormType) => {
    console.log(formValues);
  };

  //tsx
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputComponent label="Nombre" registerName="name" register={register} />
      <InputComponent
        label="Apellido"
        registerName="lastName"
        register={register}
      />
      <InputComponent
        label="Teléfono"
        registerName="phoneNumber"
        register={register}
      />
      <InputComponent label="Email" registerName="email" register={register} />

      <InputComponent
        label="Link de Google Maps"
        registerName="locationLink"
        register={register}
      />
      <InputComponent
        label="Dirección exacta"
        registerName="exactLocation"
        register={register}
      />

      <button type="submit" className="bg-blue px-5 py-2 text-sm text-creme">
        Submit
      </button>
    </form>
  );
};
const Index = ({}) => {
  return (
    <>
      <div className="px-20 py-8">
        <h1 className=" text-2xl tracking-tight">Configuración</h1>
        <hr className="mt-6" />
        <div className="my-3 flex ">
          <aside className="float-left  flex flex-col space-y-6  py-2  text-left [&>*]:px-5 [&>*]:py-2 [&>*]:text-left">
            <button className="rounded-sm  text-sm  hover:bg-zinc-100 focus:bg-zinc-100">
              Perfil
            </button>
            <button className="rounded-sm  text-sm hover:bg-zinc-100 focus:bg-zinc-100">
              Monedero
            </button>
          </aside>

          <div className="ml-7 w-2/3  ">
            <ProfileSettings />
          </div>
        </div>
      </div>
      {/* <form className="">
        <div className="grid grid-cols-3 gap-x-5 gap-y-2 px-32">
          <InputComponent label="Nombre" updatingProfile={updatingProfile} />
          <InputComponent label="Apellido" updatingProfile={updatingProfile} />
          <InputComponent label="Teléfono" updatingProfile={updatingProfile} />
          <InputComponent label="Email" updatingProfile={updatingProfile} />

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
      )} */}
    </>
  );
};

function InputComponent({
  label,
  updatingProfile,
  registerName,
  register,
}: {
  label: string;
  updatingProfile?: boolean;
  registerName: keyof ProfileFormType;
  register: UseFormRegister<ProfileFormType>;
}) {
  return (
    <div className="col-span-1 flex flex-col">
      <label htmlFor="" className="mb-1 text-xs font-medium">
        {label}
      </label>
      <input
        {...register(registerName)}
        type="text"
        placeholder={label}
        className={`rounded border
        border-blue  border-opacity-25 bg-creme px-2 py-1  text-sm outline-none placeholder:text-sm `}
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

export default Index;
