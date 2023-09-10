import React from "react";
import Link from "next/link";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { BsPerson, BsHeart } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { User } from "@prisma/client";
import { IoWalletOutline } from "react-icons/io5";

interface NavbarProps {}

const ProfileButton = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <div className="  relative flex items-center justify-between ">
        <button className="peer right-0  overflow-hidden rounded-full">
          <Image
            src={sessionData?.user.image || "/default-profile-picture.jpg"}
            width={32}
            height={32}
            alt="Profile image"
          />
        </button>
        <div className="border-orange bg-creme absolute right-0  top-full z-20 mt-5  h-72 w-64 flex-col rounded-md border-2 peer-hover:flex ">
          {/* upper  */}
          <div className="my-3">
            {" "}
            <Image
              className="mx-auto rounded-full"
              src={sessionData?.user.image || "/default-profile-picture.jpg"}
              width={40}
              height={40}
              alt="Profile image"
            />
            <h1 className="text-center">{sessionData?.user.name}</h1>
            <p className="text-center text-xs  "> {sessionData?.user.email} </p>
          </div>

          <div className="mt-5 flex flex-col gap-y-2">
            <div className="flex flex-row items-center px-3   hover:shadow-sm">
              <span>
                {<IoWalletOutline className="text-orange text-3xl" />}
              </span>
              <span className="pl-2 text-sm font-semibold">Su monedero</span>
            </div>
            <div className="flex flex-row items-center px-3 hover:shadow-sm">
              <span>
                {<IoWalletOutline className="text-orange text-3xl" />}
              </span>
              <span className="pl-2 text-sm font-semibold">Su monedero</span>
            </div>
            <div className="flex flex-row items-center px-3 hover:shadow-sm">
              <span>
                {<IoWalletOutline className="text-orange text-3xl" />}
              </span>
              <span className="pl-2 text-sm font-semibold">Su monedero</span>
            </div>
            <div className="flex flex-row items-center px-3 hover:shadow-sm">
              <span>
                {<IoWalletOutline className="text-orange text-3xl" />}
              </span>
              <span className="pl-2 text-sm font-semibold">Su monedero</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data: sessionData } = useSession();
  return (
    <div className="border-b border-zinc-200 pb-2">
      <div className="relative flex h-16 items-center justify-between  px-[7%]">
        <div className="flex items-center gap-x-5">
          <Link href="#_">
            <h1 className="text-lg">Vende</h1>
          </Link>
          <Link href="#_">
            <h1 className="text-lg">Compra</h1>
          </Link>
          <Link href="#_">
            <h1 className="text-lg">Nosotros</h1>
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-3xl">Logo</h1>
        </div>
        <div className="flex items-center gap-x-5">
          <Link href="#_">
            <IoSearchOutline className="text-3xl" />
          </Link>
          <Link href="#_">
            <BsHeart className="text-2xl" />
          </Link>
          <Link href="#_">
            <PiHandbagSimpleLight className="text-3xl" />
          </Link>
          {/* <ProfileCard /> */}
          <ProfileButton />
        </div>
      </div>
      <div className="  mx-auto flex  h-7 items-center justify-center gap-x-14  ">
        <div className="">
          <button className="font-antonio hover:text-orange focus:text-orange peer relative text-sm">
            Ropa
          </button>
          <div
            className="bg-creme absolute right-1/2  mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs font-semibold hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>

        <div>
          <button className="p font-antonio hover:text-orange focus:text-orange peer text-sm">
            Deporte
          </button>
          <div
            className="bg-creme absolute  right-1/2 mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs font-semibold hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>
        <div>
          <button className="font-antonio hover:text-orange focus:text-orange peer text-sm">
            Zapatos
          </button>
          <div
            className="bg-creme absolute right-1/2 mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs font-semibold hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>

        <div>
          <button className="font-antonio hover:text-orange focus:text-orange peer text-sm">
            Accesorios
          </button>
          <div
            className="bg-creme absolute right-1/2 mt-[10px] hidden translate-x-1/2 flex-col border 
         border-zinc-200  hover:flex peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs font-semibold hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-quicksand hover:text-green px-5 py-2  text-xs hover:-translate-y-[1px] hover:font-semibold"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
