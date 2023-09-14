import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";

interface Props {}

const prenda: React.FC<Props> = ({}) => {
  const { id } = useRouter().query;
  //type check
  if (!id || id instanceof Array) {
    return <div>NO SUCH GARMENT !!!</div>;
  }
  const { data } = api.garments.getOne.useQuery({ id: id });
  return <div>{data?.brand}</div>;
};

export default prenda;
