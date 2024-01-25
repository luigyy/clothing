import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BsArrowReturnLeft } from "react-icons/bs";

const LoginModal = ({
  showModal,
  setShowModal,
}: {
  showModal?: boolean;
  setShowModal?: (modal: boolean) => void;
}) => {
  const router = useRouter();

  const buttonElement = useRef<HTMLButtonElement>(null);
  //listen for clicks outside of input div and close it
  useEffect(() => {
    const handler = (e: any) => {
      if (!buttonElement.current?.contains(e.target)) {
        setShowModal && setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return (
    <>
      {showModal ? (
        <div
          placeholder="Buscar prendas"
          className="grid-col-4 fixed  left-0 top-0 z-50 mx-auto flex h-screen max-h-full w-screen max-w-full items-center  justify-center  bg-blue/10 backdrop-blur-[2px]  transition-all duration-300 "
        >
          <div className=" absolute mx-auto flex aspect-video w-5/12 flex-col items-center justify-center gap-y-1 rounded-lg bg-creme px-3  py-4 text-center shadow-sm">
            <h1 className="py-2 text-center font-bold">
              No has iniciado sesión aún!
            </h1>
            <h1 className="text-center text-sm font-bold">
              Ya casi estás logueado, solo presiona el botón de abajo
            </h1>
            <h1 className="text-center text-sm font-bold ">
              e inicia sesión en menos de 10 segundos
            </h1>
            <button
              ref={buttonElement}
              className="btn my-4"
              onClick={async () => await signIn()}
            >
              Inicia sesión
            </button>
            <button
              onClick={() => router.back()}
              className="absolute left-4 top-4 "
            >
              <BsArrowReturnLeft className="text-4xl" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default LoginModal;
