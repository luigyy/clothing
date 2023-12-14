import { useEffect } from "react";
import {
  ProvinceSelect,
  MunicipalitySelect,
  DistrictSelect,
  Location as useCostaRicaLocation,
} from "react-select-costarica-location";

interface LocationFormProps {
  //state function to update location object in parent component
  setLocationFn: ({
    province,
    municipality,
    district,
  }: {
    province: string;
    municipality: string;
    district: string;
  }) => void;
}

export default function LocationForm({ setLocationFn }: LocationFormProps) {
  const {
    provincia: province,
    canton: municipality,
    distrito: district,
  } = useCostaRicaLocation();

  //   this is to update the location in the parent component
  function updateLocation() {
    if (!(province && municipality && district)) return;
    return setLocationFn({ province, municipality, district });
  }

  useEffect(() => {
    updateLocation();
  }, [province, municipality, district]);

  return (
    <>
      <ProvinceSelect
        ContainerClassName="flex flex-col"
        LabelClassName="pb-1 text-xs font-medium"
        SelectInputClassName="rounded border border-blue border-opacity-10 bg-creme p-2 text-sm shadow-sm outline-none placeholder:text-sm"
      />
      <MunicipalitySelect
        ContainerClassName="flex flex-col"
        LabelClassName="pb-1 text-xs font-medium"
        SelectInputClassName="rounded border border-blue border-opacity-10 bg-creme p-2 text-sm shadow-sm outline-none placeholder:text-sm"
      />
      <DistrictSelect
        ContainerClassName="flex flex-col"
        LabelClassName="pb-1 text-xs font-medium"
        SelectInputClassName="rounded border border-blue border-opacity-10 bg-creme p-2 text-sm shadow-sm outline-none placeholder:text-sm"
      />
    </>
  );
}
