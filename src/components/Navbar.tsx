import React, { useEffect, useState } from "react";
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
      <div className="   relative flex items-center justify-between ">
        <button className="peer right-0 h-[32px] w-[32px] overflow-hidden rounded-full focus:ring focus:ring-orange  ">
          <Image
            src={sessionData?.user.image || "/default-profile-picture.jpg"}
            className=""
            width={32}
            height={32}
            alt="Profile image"
          />
        </button>
        {/* profile card  */}
        <div
          className={`absolute right-0 top-full z-10 hidden    bg-creme ${
            sessionData ? "h-72" : "h-52"
          }  w-64 flex-col rounded-md   shadow-2xl ring-1 ring-orange ring-opacity-30 hover:flex peer-hover:flex  peer-focus:flex`}
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
                  <span>
                    {<VscAccount className="text-2xl text-orange opacity-70" />}
                  </span>
                  <button className="pl-2 text-sm ">Ver perfil</button>
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
                    {<CiSettings className="text-2xl text-orange opacity-70" />}
                  </span>
                  <button className="pl-2 text-sm ">Configuración</button>
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
  const [stickyNav, setStickyNav] = useState<boolean>(false);

  useEffect(() => {
    window.onscroll = () => {
      setStickyNav(window.scrollY === 0 ? false : true);
      return () => (window.onscroll = null);
    };
  }, []);
  const hoverUnderlineClass =
    "before:contents-['']  before:absolute before:-bottom-0 before:w-0 before:border-b-2  before:border-orange before:transition-all hover:before:w-full";
  return (
    <div className="border-b  border-zinc-200 pb-2">
      <div
        className={`top-0 flex h-16 w-full items-center justify-between  px-[7%] `}
      >
        <div className="flex items-center gap-x-5">
          <Link href="/sell" className={` relative ${hoverUnderlineClass}`}>
            <h1 className="text-lg">Vende</h1>
          </Link>
          <Link href="/garments" className={`${hoverUnderlineClass} relative`}>
            <h1 className="text-lg">Compra</h1>
          </Link>
          <Link href="#_" className={`${hoverUnderlineClass} relative`}>
            <h1 className="text-lg">Nosotros</h1>
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-3xl">
            <Image src="/logo-azul.png" width={130} height={130} alt="logo" />
          </Link>
        </div>
        <div className="flex items-center gap-x-5">
          <Link href="#_">
            <IoSearchOutline className="text-3xl" />
          </Link>
          <Link href="/favorites">
            <BsHeart className="text-2xl" />
          </Link>
          <Link href="#_">
            <PiHandbagSimpleLight className="text-3xl" />
          </Link>
          {/* <ProfileCard /> */}
          <ProfileButton />
        </div>
      </div>
      <div
        className={` z-20  mx-auto flex h-7 items-center justify-center gap-x-14  `}
      >
        <div className="">
          <button className="peer relative font-title text-sm hover:text-orange focus:text-orange">
            Ropa
          </button>
          <div
            className="absolute right-1/2 z-10 mt-[10px] hidden translate-x-1/2 flex-col border border-orange border-opacity-40 bg-creme shadow-2xl 
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
        </div>

        <div>
          <button className="p peer font-title text-sm hover:text-orange focus:text-orange">
            Deporte
          </button>
          <div
            className="absolute  right-1/2 z-10 mt-[10px] hidden translate-x-1/2 flex-col border border-orange border-opacity-40  bg-creme 
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
        </div>
        <div>
          <button className="peer font-title text-sm hover:text-orange focus:text-orange">
            Zapatos
          </button>
          <div
            className="absolute right-1/2 z-10 mt-[10px] hidden translate-x-1/2 flex-col  border border-orange  border-opacity-40 bg-creme 
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
        </div>

        <div>
          <button className="peer font-title text-sm hover:text-orange focus:text-orange">
            Accesorios
          </button>
          <div
            className="absolute right-1/2 z-10 mt-[10px] hidden translate-x-1/2 flex-col border border-orange  border-opacity-40  
         bg-creme  hover:flex peer-hover:flex peer-focus:flex md:w-1/2"
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
