import React from "react";
import Link from "next/link";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { BsPerson, BsHeart } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { IoWalletOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

interface NavbarProps {}

const ProfileButton = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <div className="  relative flex items-center justify-between ">
        <button className="peer right-0 h-[32px] w-[32px] overflow-hidden rounded-full focus:ring focus:ring-orange  ">
          <Image
            src={sessionData?.user.image || "/default-profile-picture.jpg"}
            className=""
            width={32}
            height={32}
            alt="Profile image"
          />
        </button>

        <div
          className={`absolute right-0 top-full z-20 hidden  border-orange  bg-creme ${
            sessionData ? "h-72" : "h-52"
          }  w-64 flex-col rounded-md border-2 hover:flex peer-hover:flex  peer-focus:flex`}
        >
          {/* upper  */}
          {sessionData ? (
            <>
              <div className="my-3">
                {" "}
                <Image
                  className="mx-auto rounded-full grayscale"
                  src={
                    sessionData?.user.image || "/default-profile-picture.jpg"
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
                <div className="flex flex-row items-center px-3 hover:text-orange   ">
                  <span>{<VscAccount className="text-3xl text-orange" />}</span>
                  <button className="pl-2 text-sm ">Ver perfil</button>
                </div>
                <div className="flex flex-row items-center px-3 hover:text-orange">
                  <span>
                    {<IoWalletOutline className="text-3xl text-orange" />}
                  </span>
                  <button className="pl-2 text-sm ">Ver monedero</button>
                </div>
                <div className="flex flex-row items-center px-3 hover:text-orange ">
                  <span>{<CiSettings className="text-3xl text-orange" />}</span>
                  <button className="pl-2 text-sm ">Configuración</button>
                </div>
                <div className="flex flex-row items-center px-3 hover:text-orange ">
                  <span>
                    {
                      <IoIosHelpCircleOutline className="text-3xl text-orange" />
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
                <h1 className="text-center text-lg">No estas logueado</h1>
              </span>
              <div className="flex flex-col gap-y-4 ">
                <div className="mt-5 flex items-center  px-2">
                  <div>
                    <FiLogIn className="text-2xl text-orange" />
                  </div>
                  <button
                    className="pl-3 text-sm font-semibold hover:text-orange "
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
                    className="pl-2 text-sm font-semibold hover:text-orange "
                    onClick={() => signIn()}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </div>
          )}
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
          <Link href="/vende" className="">
            <h1 className="font-text">Vende</h1>
          </Link>
          <Link href="/prendas">
            <h1 className="text-lg">Compra</h1>
          </Link>
          <Link href="#_">
            <h1 className="text-lg">Nosotros</h1>
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-3xl">
            Logo
          </Link>
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
          <button className="font-title peer relative text-sm hover:text-orange focus:text-orange">
            Ropa
          </button>
          <div
            className="absolute right-1/2 mt-[10px]  hidden translate-x-1/2 flex-col border border-zinc-200 bg-creme 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-text px-5 py-2 text-xs  font-semibold hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>

        <div>
          <button className="p font-title peer text-sm hover:text-orange focus:text-orange">
            Deporte
          </button>
          <div
            className="absolute right-1/2  mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 bg-creme 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-text px-5 py-2 text-xs  font-semibold hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>
        <div>
          <button className="font-title peer text-sm hover:text-orange focus:text-orange">
            Zapatos
          </button>
          <div
            className="absolute right-1/2 mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 bg-creme 
         hover:flex  peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-text px-5 py-2 text-xs  font-semibold hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
          </div>
        </div>

        <div>
          <button className="font-title peer text-sm hover:text-orange focus:text-orange">
            Accesorios
          </button>
          <div
            className="absolute right-1/2 mt-[10px] hidden translate-x-1/2 flex-col border border-zinc-200 
         bg-creme  hover:flex peer-hover:flex peer-focus:flex md:w-1/2"
          >
            <Link
              className="font-text px-5 py-2 text-xs  font-semibold hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Ver todo
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Abrigos
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
              href="#"
            >
              Jeans
            </Link>
            <Link
              className="font-text px-5 py-2 text-xs  hover:-translate-y-[1px] hover:font-semibold hover:text-green"
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
