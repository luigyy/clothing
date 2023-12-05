import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import FsLightbox from "fslightbox-react";
import Button from "~/components/Button";
import { BsHeart, BsTruck } from "react-icons/bs";
import Recommendations from "~/components/Recommendations";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AiFillHeart } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

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

const Garment = () => {
  //get garment id
  const { id } = useRouter().query;

  //error handling
  if (!id || id instanceof Array) {
    return <div>Redirect...</div>;
  }
  //query garment with garment id
  const { data: myData, isLoading } = api.garments.getOne.useQuery({
    id: id,
  });
  const garment = myData?.garment;

  //mutation
  const toggleLike = api.garments.toggleLike.useMutation();
  const addToCart = api.orders.addGarmentToCart.useMutation();
  const { data: myCart } = api.orders.getCurrentUserCart.useQuery();

  const utils = api.useContext();

  const garmentIsInCart = myCart?.garments.find((garment) => garment.id === id);

  //handler for liking button
  async function handleLike() {
    if (!garment?.id) return;
    // //perform action
    await toggleLike.mutateAsync(
      { garmentId: garment.id },
      //refresh cache
      {
        onSuccess: () => {
          //update cache
          utils.garments.getOne.setData({ id: garment.id }, (garment) => {
            if (!garment?.garment) return;

            //
            if (!garment) return;
            const oldGarment = garment.garment;
            //
            return {
              ...garment,
              garment: {
                ...oldGarment,
                _count: {
                  likes:
                    oldGarment._count.likes + (garment.isFavorite ? -1 : 1),
                },
              },
              isFavorite: !garment.isFavorite,
            };
          });
        },
      },
    );
  }

  function handleAddToCart(garmentId: string) {
    function addToCartFn() {
      return addToCart.mutateAsync(
        { garmentId },
        {
          onSuccess: (res) => {
            if (res.error) return;
            utils.orders.getCurrentUserCart.setData(undefined, (oldData) => {
              if (!oldData || !garment) return;

              return {
                ...oldData,
                garments: [...oldData.garments, garment],
              };
            });
          },
        },
      );
    }

    //toast
    toast.promise(addToCartFn, {
      pending: "Añadiendo al carrito",
      success: "Añadido correctamente al carrito ",
      error: "Error al añadir al carrito",
    });
  }

  // To open the lightbox change the value of the "toggler" prop.
  const [toggler, setToggler] = useState(false);

  // array of pictures for lightbox
  const [picturesUrls, setPicturesUrls] = useState<string[]>([]);

  //populate array of pictures
  useEffect(() => {
    let tempArray: string[] = [];
    garment?.pictures.forEach((picture) => {
      tempArray.push(picture.url);
    });
    setPicturesUrls(tempArray);
  }, [garment]);

  //show skeleton on loading
  if (isLoading) {
    return (
      <div className="flex px-32 py-5">
        {/* left  */}
        <div className="sticky top-5 flex h-[475px] w-1/2 justify-evenly  ">
          <div className="flex w-1/6 flex-col  gap-y-1 py-1 ">
            <Skeleton height={475} />
          </div>
          <div className="w-4/6">
            <Skeleton height={475} />
          </div>
        </div>
        {/* end left */}

        <div className="mx-auto w-[45%]  px-10   ">
          <Skeleton height={475} />
        </div>
      </div>
    );
  }

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
                src={garment?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md"
            >
              <img
                src={garment?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md"
            >
              <img
                src={garment?.pictures[0]!.url}
                className="h-full  w-full object-cover"
                alt=""
              />
            </button>
            <button
              onClick={() => setToggler((prev) => !prev)}
              className="h-1/4 overflow-hidden rounded-md shadow-2xl"
            >
              <img
                src={garment?.pictures[0]!.url}
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
              src={garment?.pictures[0]!.url}
              className="h-full  w-full object-cover"
              alt=""
            />
          </button>
        </div>
        {/* specs */}
        <div className="mx-auto w-[45%] rounded-lg border border-blue px-10 py-10  ">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">{garment?.brand}</h1>
            <span className="text-xs text-orange underline">
              {garment?.user.name}
            </span>
          </div>
          <span className="inline text-sm">
            Talla: {garment?.size}/
            {garment?.genre === "male" ? "Hombre" : "Mujer"}
          </span>
          <p className="pt-10  text-2xl">
            ₡{garment?.current_price.toLocaleString()}
            <span className="pl-2 text-sm text-orange line-through">
              {garment?.original_price === garment?.current_price
                ? null
                : `₡${garment?.original_price.toLocaleString()}`}
            </span>
          </p>
          <div className=" flex items-center  gap-x-2 border-b border-blue border-opacity-50 pb-10 pt-4">
            <Button
              tw_text_size="text-xs"
              back_color="blue"
              id={id}
              isLoading={addToCart.isLoading}
              loadingContent="Añadiendo"
              handlerFn={handleAddToCart}
              content={`${
                garmentIsInCart ? "Ya está en el bolsa" : "Añadir a la bolsa"
              } `}
              disabled={garmentIsInCart ? true : false}
            />
            <button
              onClick={handleLike}
              disabled={toggleLike.isLoading}
              className="flex items-center gap-x-2  pl-4"
            >
              {toggleLike.isLoading ? (
                <ClipLoader color="#93a571" size={23} />
              ) : myData?.isFavorite ? (
                <AiFillHeart className="text-2xl text-green" />
              ) : (
                <FiHeart className="text-2xl text-green" />
              )}

              <p className="text-xl text-green">{garment?._count.likes ?? 0}</p>
            </button>
          </div>

          <div className="">
            <h1 className="pt-2 text-lg font-semibold">Especificaciones</h1>
            <div className="flex flex-col gap-y-2 pl-2">
              <h1 className="pb-2 pt-4 font-semibold">Medidas</h1>
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
              />{" "}
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
              />{" "}
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
              />
              <MeasurementsComponent
                left="Talla original"
                right={garment?.size!}
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
        <Recommendations />
      </div>
      <FsLightbox toggler={toggler} sources={picturesUrls} />
    </div>
  );
};

export default Garment;
