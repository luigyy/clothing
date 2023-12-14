import React, { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { BsPerson, BsHeart } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { IoWalletOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { api } from "~/utils/api";
import { BsTrash } from "react-icons/bs";
import type { Garment } from "@prisma/client";
import ClipLoader from "react-spinners/ClipLoader";
import { MdSearch } from "react-icons/md";
import { useRouter } from "next/router";
import useOnClickOutside from "./useOnClickOutside";

const ProfileButton = () => {
  const { data: sessionData } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setDropdownOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <>
      <div ref={ref} className="   relative flex items-center justify-between ">
        <button
          className="click-effect peer right-0 h-[32px] w-[32px] overflow-hidden rounded-full   "
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Image
            src={sessionData?.user.image ?? "/default-profile-picture.jpg"}
            className=""
            width={32}
            height={32}
            alt="Profile image"
          />
        </button>
        {/* profile card  */}

        {dropdownOpen ? (
          <div
            className={`absolute right-0 top-full z-30 flex  w-64 flex-col rounded-md bg-creme   pb-5 shadow-2xl ring-1 ring-orange ring-opacity-30`}
          >
            {/* upper  */}
            {sessionData ? (
              <>
                <div className="my-3">
                  {" "}
                  <Image
                    className="mx-auto rounded-full "
                    src={
                      sessionData?.user.image ?? "/default-profile-picture.jpg"
                    }
                    width={40}
                    height={40}
                    alt="Profile image"
                  />
                  <h1 className="text-center">{sessionData?.user.name}</h1>
                  <p className="text-center text-xs  ">
                    {" "}
                    {sessionData?.user.email}{" "}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-y-2">
                  <div className="flex flex-row items-center px-3 hover:text-orange ">
                    <span>
                      {
                        <CiSettings className="text-2xl text-orange opacity-70" />
                      }
                    </span>
                    <Link href={"/settings"} className="pl-2 text-sm ">
                      Configuración
                    </Link>
                  </div>
                  <div className="flex flex-row items-center px-3 hover:text-orange">
                    <span>
                      {
                        <IoWalletOutline className="text-2xl text-orange opacity-70" />
                      }
                    </span>
                    <button className="pl-2 text-sm ">Ver monedero</button>
                  </div>

                  <div className="flex flex-row items-center px-3 hover:text-orange ">
                    <span>
                      {
                        <IoIosHelpCircleOutline className="text-2xl text-orange opacity-70" />
                      }
                    </span>
                    <button
                      className="pl-2 text-sm "
                      onClick={() => void signOut()}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 ">
                <span>
                  {
                    <BsPerson className="mx-auto text-center text-3xl text-orange" />
                  }
                  <h1 className="text-center text-lg">No estás logueado</h1>
                </span>
                <div className="flex flex-col gap-y-4 ">
                  <div className="mt-5 flex items-center  px-2">
                    <div>
                      <FiLogIn className="text-2xl text-orange" />
                    </div>
                    <button
                      className="pl-3 text-sm  hover:text-orange "
                      onClick={() => signIn()}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                  <div className="flex items-center px-2">
                    <div>
                      <FiUserPlus className="ml-1 text-2xl text-orange" />
                    </div>
                    <button
                      className="pl-2 text-sm  hover:text-orange "
                      onClick={() => signIn()}
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

export const ItemRow = ({
  brand,
  size,
  genre,
  garmentId,
  current_price,
}: {
  brand: string;
  size: string;
  genre: string;
  garmentId: string;
  current_price: number;
}) => {
  const [isDeleting, setDeletingId] = useState("");
  const deleteFromCart = api.orders.deleteGarmentFromCart.useMutation();
  const utils = api.useContext();
  //handler for delete button
  function handleDeleteFromCart(id: string) {
    setDeletingId(id);
    deleteFromCart.mutate(
      { garmentId: id },
      {
        onSuccess: () => {
          utils.orders.getCurrentUserCart.setData(undefined, (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              garments: oldData.garments.filter((garment) => garment.id != id),
            };
          });
          setDeletingId("");
        },
      },
    );
  }

  return (
    <>
      <div className="flex items-center justify-between  px-3 py-1 hover:text-orange">
        <button
          className="transition-all duration-200 hover:scale-105"
          onClick={() => handleDeleteFromCart(garmentId)}
        >
          {isDeleting ? (
            <ClipLoader color="#d8690e" size={23} />
          ) : (
            <BsTrash className="text-3xl text-orange" />
          )}
        </button>
        <div className="">
          <span className="text-sm">{brand}</span>
          <p className="text-xs   ">
            {size}/{genre}
          </p>
        </div>
        <p className="text-sm">₡{current_price.toLocaleString()}</p>
      </div>
    </>
  );
};

const ShoppingCartDropdown = () => {
  const { data } = api.orders.getCurrentUserCart.useQuery();
  const [cartTotal, setCartTotal] = useState(calculateTotal(data?.garments));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  //
  function calculateTotal(garments: Garment[] | null | undefined) {
    if (!garments) return 0;

    let total = 0;
    garments.forEach((garment) => {
      total += garment.current_price;
    });
    return total;
  }

  useEffect(() => {
    setCartTotal(calculateTotal(data?.garments));
  }, [data]);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setDropdownOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div ref={ref} className="relative mt-1 ">
      <button className="peer ">
        <PiHandbagSimpleLight
          className="click-effect text-3xl"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {cartTotal != 0 ? (
          <span className="min-w-7 absolute -top-2 left-5 flex h-4 items-center justify-center rounded-[4px] bg-orange px-2 py-1 text-center font-text text-[10px] text-creme">
            {`₡${cartTotal.toLocaleString()}`}
          </span>
        ) : null}
      </button>
      {data?.garments.length && dropdownOpen ? (
        <div
          className={`absolute right-0 top-full z-30  px-3 pb-3  ${
            data?.garments.length ? "" : "text-sm text-opacity-50"
          }  flex  w-64 flex-col rounded-md   bg-creme shadow-2xl ring-1 ring-orange ring-opacity-30`}
        >
          <h1 className="pb-3 pt-2 text-center text-sm">Tus pedidos</h1>
          <>
            <div className="mb-5">
              {data.garments.map((garment, index) => (
                <ItemRow
                  garmentId={garment.id}
                  brand={garment.brand}
                  current_price={garment.current_price}
                  genre={garment.genre}
                  size={garment.size}
                  key={index}
                />
              ))}
            </div>
            <Link
              onClick={() => setDropdownOpen(false)}
              className="btn "
              href={"/cart"}
            >
              Ir al carrito
            </Link>
          </>
        </div>
      ) : null}
    </div>
  );
};

const DropdownMenu = ({}) => {
  return (
    <div
      className="absolute right-1/2 z-20 mt-[10px] hidden translate-x-1/2 flex-col border border-orange border-opacity-40 bg-creme shadow-2xl 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
    >
      <Link
        className="px-5 py-2 font-text text-xs  font-semibold hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Ver todo
      </Link>
      <Link
        className="px-5 py-2 font-text text-xs hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Abrigos
      </Link>
      <Link
        className="px-5 py-2 font-text text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Jeans
      </Link>
      <Link
        className="px-5 py-2 font-text text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Jeans
      </Link>
      <Link
        className="px-5 py-2 font-text text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Jeans
      </Link>
      <Link
        className="px-5 py-2 font-text text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
        href="#"
      >
        Jeans
      </Link>
    </div>
  );
};

const SubNavbar = () => {
  return (
    <div
      className={` relative  z-20 mx-auto flex h-7 items-center justify-center gap-x-14  `}
    >
      <div className="">
        <button className="peer relative font-title text-sm hover:text-orange focus:text-orange">
          Ropa
        </button>
        <DropdownMenu />
      </div>
      <div>
        <button className="p peer font-title text-sm hover:text-orange focus:text-orange">
          Deporte
        </button>
        <DropdownMenu />
      </div>
      <div>
        <button className="peer font-title text-sm hover:text-orange focus:text-orange">
          Zapatos
        </button>
        <DropdownMenu />
      </div>

      <div>
        <button className="peer font-title text-sm hover:text-orange focus:text-orange">
          Accesorios
        </button>
        <DropdownMenu />
      </div>
    </div>
  );
};

const Navbar = ({}) => {
  const router = useRouter();

  const [searchBarIsOpen, setSearchBarIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const inputElement = useRef<HTMLInputElement>(null);

  function handleEnter(e: KeyboardEvent) {
    const link = `/garments?search=${search}`;
    if (e.key === "Enter") {
      router.push(link);
      setSearchBarIsOpen(false);
    }
  }

  //autofocus input
  useEffect(() => {
    if (searchBarIsOpen) {
      inputElement.current?.focus();
    }
  });

  //listen for clicks outside of input div and close it
  useEffect(() => {
    const handler = (e: any) => {
      if (!inputElement.current?.contains(e.target)) {
        setSearchBarIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  //
  return (
    <div className="relative overflow-x-clip">
      {searchBarIsOpen ? (
        <div className="absolute  z-40 h-screen w-screen bg-black/10 backdrop-blur-[1px]  "></div>
      ) : null}
      <div className=" ">
        <div
          className={`top-0 flex h-16 w-full items-center justify-between  px-[7%] `}
        >
          <div className="flex items-center gap-x-8">
            <Link
              href="/sell"
              className="click-effect relative font-title  text-xl font-semibold"
            >
              Vende
            </Link>
            <Link
              href="/garments"
              className="click-effect relative font-title  text-xl font-semibold"
            >
              Compra
            </Link>
            {/* <Link
              href="#_"
              className={`${hoverUnderlineClass} relative text-lg`}
            >
              Nosotros
            </Link> */}
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className=" text-3xl">
              <Image
                src="/logo-azul.png"
                width={130}
                height={130}
                alt="logo"
                className="click-effect"
              />
            </Link>
          </div>
          <div className="flex items-center gap-x-8">
            <button onClick={() => setSearchBarIsOpen(!searchBarIsOpen)}>
              <IoSearchOutline className="click-effect text-3xl" />
            </button>
            <Link href="/favorites">
              <BsHeart className="click-effect text-2xl" />
            </Link>
            <ShoppingCartDropdown />
            <ProfileButton />
          </div>
        </div>
        {/* search bar  */}
        <div
          placeholder="Buscar prendas"
          className={`${
            searchBarIsOpen
              ? "  z-50 -translate-y-0"
              : " -z-10 -translate-y-full opacity-0"
          }  grid-col-4 absolute right-1/2 mx-auto flex   w-1/3 translate-x-1/2 justify-center   transition-all duration-300 `}
        >
          <input
            ref={inputElement}
            onKeyDown={(e) => handleEnter(e)}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className=" h-full w-full rounded bg-blue p-2 text-creme outline-none placeholder:text-sm placeholder:text-creme"
            placeholder="Buscar prenda"
          />

          <Link
            href={`/garments?search=${search}`}
            onFocus={() => setSearchBarIsOpen(true)}
            className=" rounded  bg-blue px-4  text-sm"
          >
            <MdSearch className="text-3xl text-creme" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
