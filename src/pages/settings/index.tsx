//TODO: create layout and move input componenets to components folder
import React, { useEffect, useState } from "react";
import { useForm, UseFormRegister, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { api } from "~/utils/api";
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
// Import your language translation files
import translation from "zod-i18n-map/locales/es/zod.json";

// lng and resources key depend on your locale.
i18next.init({
  lng: "es",
  resources: {
    es: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);

const ProfileFormSchema = z.object({
  name: z.string().min(3),
  lastName: z.string(),
  phoneNumber: z.string().min(7, {
    message: "El número de celular debe contener al menos 8 caracteres",
  }),
  email: z.string().email(),
  locationLink: z.string(),
  exactLocation: z.string(),
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

const ProfileSettings = () => {
  const { data } = api.users.getCurrentUser.useQuery();
  const updateUser = api.users.updateUser.useMutation();

  //useForm stuff
  const { register, handleSubmit, formState, reset } = useForm<ProfileFormType>(
    {
      resolver: zodResolver(ProfileFormSchema),
    },
  );

  const { errors, isDirty, dirtyFields } = formState;

  //handlers
  const onSubmit = (formValues: ProfileFormType) => {
    updateUser.mutate({
      id: data?.id || "",
      newLastName: formValues.lastName,
      newName: formValues.name,
    });
  };

  //set default values when user information is retrieved
  useEffect(() => {
    const defaultValues = {
      name: data?.name ?? "",
      lastName: data?.lastName ?? "",
      email: data?.email ?? "",
      exactLocation: data?.exactLocation ?? "",
      locationLink: data?.locationLink ?? "",
      phoneNumber: data?.phoneNumber ?? "",
    };
    reset({ ...defaultValues });
  }, [data]);
  //tsx
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputComponent
        label="Nombre"
        registerName="name"
        register={register}
        error={errors.name}
      />
      <InputComponent
        label="Apellido"
        registerName="lastName"
        register={register}
        error={errors.lastName}
      />
      <InputComponent
        label="Teléfono"
        registerName="phoneNumber"
        register={register}
        error={errors.phoneNumber}
        inputInfo="
 * Por favor NO INCLUIR el código de país
        "
      />
      <InputComponent
        label="Email"
        registerName="email"
        register={register}
        error={errors.email}
      />

      <InputComponent
        label="Link de Google Maps"
        registerName="locationLink"
        register={register}
        error={errors.locationLink}
      />
      <InputComponent
        label="Dirección exacta"
        registerName="exactLocation"
        register={register}
        error={errors.exactLocation}
      />

      {isDirty ? (
        <button
          type="submit"
          className="clickable-effect rounded bg-blue px-5 py-2 text-sm text-creme"
        >
          Actualizar perfil
        </button>
      ) : null}
    </form>
  );
};
const Index = ({}) => {
  const pathname = usePathname();
  return (
    <>
      <div className="px-20 py-8">
        <h1 className=" text-2xl tracking-tight">Configuración</h1>
        <hr className="mt-6" />
        <div className="my-3 flex ">
          <aside className="float-left  flex flex-col space-y-6  py-2  text-left [&>*]:px-5 [&>*]:py-2 [&>*]:text-left">
            <button
              className={`clickable-effect rounded  text-sm ${
                pathname === "/settings" ? " bg-green bg-opacity-50" : ""
              } `}
            >
              Perfil
            </button>
            <button
              className={`clickable-effect rounded  text-sm ${
                pathname === "/settings/monedero"
                  ? " bg-green bg-opacity-50"
                  : ""
              } `}
            >
              Monedero
            </button>
          </aside>

          <div className="ml-7 w-2/3 max-w-2xl  ">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </>
  );
};

function InputComponent({
  label,
  updatingProfile,
  registerName,
  error,
  register,
  inputInfo,
}: {
  label: string;
  updatingProfile?: boolean;
  registerName: keyof ProfileFormType;
  error: FieldError | undefined;
  register: UseFormRegister<ProfileFormType>;
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
