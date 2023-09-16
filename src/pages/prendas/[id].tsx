import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import FsLightbox from "fslightbox-react";
import Button from "~/components/Button";
import { BsHeart, BsTruck } from "react-icons/bs";
import Recommendations from "~/components/Recommendations";

interface Props {}

function MeasurementsComponent({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="flex h-8 rounded ">
      <div className="flex w-1/2 items-center bg-blue px-2  text-creme">
        {left}
      </div>
      <div className="flex w-1/2 items-center justify-end bg-green px-2 text-right  text-creme">
        {right}
      </div>
    </div>
  );
}

const Garment: React.FC<Props> = ({}) => {
  //get data
  const { id } = useRouter().query;
  //error handling
  if (!id || id instanceof Array) {
    return <div>NO SUCH GARMENT !!!</div>;
  }
  const { data } = api.garments.getOne.useQuery({ id: id });

  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);
  const [picturesUrls, setPicturesUrls] = useState<string[]>([]);

  useEffect(() => {
    let tempArray: string[] = [];
    data?.pictures.forEach((picture) => {
      tempArray.push(picture.url);
    });
    setPicturesUrls(tempArray);
  }, [data]);

  return (
    <div className=" px-32 py-5">
      <div className="flex  ">
        {/* images border  */}
        <div className="sticky top-5 flex h-[475px] w-1/2 justify-evenly  ">
          <div className="flex w-1/6 flex-col  gap-y-1 py-1 ">
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md"
            >
              <img
                src={data?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md"
            >
              <img
                src={data?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md"
            >
              <img
                src={data?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md shadow-2xl"
            >
              <img
                src={data?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
          </div>
          {/* main image */}
          <button
            onClick={() => setToggler((prev) => !prev)}
            className=" w-4/6 "
          >
            <img
              src={data?.pictures[0]!.url}
              className="h-full  w-full object-cover"
              alt=""
            />
          </button>
        </div>
        {/* specs */}
        <div className="mx-auto w-[45%] rounded-lg border border-blue px-10 py-10  ">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">{data?.brand}</h1>
            <span className="text-xs text-orange underline">
              {data?.user.name}
            </span>
          </div>
          <span className="inline text-sm">
            Talla: {data?.size}/{data?.genre === "male" ? "Hombre" : "Mujer"}
          </span>
          <p className="pt-10  text-2xl">
            ₡{data?.current_price.toLocaleString()}
            <span className="pl-2 text-sm text-orange line-through">
              {data?.original_price === data?.current_price
                ? null
                : `₡${data?.original_price.toLocaleString()}`}
            </span>
          </p>
          <div className=" flex items-center gap-x-2 border-b border-blue border-opacity-50 pb-10 pt-4">
            <Button
              tw_text_size="text-xs"
              back_color="blue"
              content="Añadir al carrito"
            />
            <button className="flex items-center gap-x-1  pl-4">
              <BsHeart className="text-2xl text-green" />
              <p className="text-xl text-green">{data?._count.likes}</p>
            </button>
          </div>

          <div className="">
            <h1 className="pt-2 text-lg font-semibold">Especificaciones</h1>
            <div className="flex flex-col gap-y-2 pl-2">
              <h1 className="pb-2 pt-4 font-semibold">Medidas</h1>
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />{" "}
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />{" "}
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={data?.size!}
              />
            </div>
          </div>

          {/* info cards */}
          <div className="flex flex-col gap-y-2 py-10">
            <div className="flex items-center rounded-lg border border-orange border-opacity-40 px-2 py-2 ">
              <div>
                <BsTruck className="text-4xl text-orange" />
              </div>
              <div className="pl-3 text-sm ">
                Tarifa fija de envio de 2000 colones en la GAM, para otras zonas
                del país la tarifa se ajusta a correos de Costa Rica.
              </div>
            </div>
            <div className=" flex items-center rounded-lg border border-orange border-opacity-40 px-2 py-2 ">
              <div>
                <BsTruck className="text-4xl text-orange" />
              </div>
              <div className="pl-3 text-sm ">
                Tarifa fija de envio de 2000 colones en la GAM, para otras zonas
                del país la tarifa se ajusta a correos de Costa Rica.
              </div>
            </div>
            <div className=" flex items-center rounded-lg border border-orange border-opacity-40 px-2 py-2 ">
              <div>
                <BsTruck className="text-4xl text-orange" />
              </div>
              <div className="pl-3 text-sm ">
                Tarifa fija de envio de 2000 colones en la GAM, para otras zonas
                del país la tarifa se ajusta a correos de Costa Rica.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" pb-10 pt-16 ">
        <Recommendations filter={{ genre: undefined }} />
      </div>

      <FsLightbox toggler={toggler} sources={picturesUrls} />
    </div>
  );
};

export default Garment;
