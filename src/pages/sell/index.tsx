import React from "react";
import Button from "../../components/Button";

interface vendeProps {}

const Vende: React.FC<vendeProps> = ({}) => {
  return (
    <div>
      {/* hero section  */}
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <h1 className="font-quicksand text-5xl font-semibold uppercase">
          Porque todo merece
        </h1>
        <h1 className="font-racing mb-5 text-center text-6xl uppercase">
          Una segunda oportunidad
        </h1>
        <Button
          back_color="orange"
          content="Agendar recolecta"
          tw_text_size={""}
        />
      </div>

      {/* como funciona  */}
      <div className="my-10 px-32">
        <h1>Como funciona?</h1>
        <ol className="list-decimal pl-4 [&>*]:py-1">
          <li>
            Busque en su closet todas las prendas que ya no use y desee darles
            una segunda vida.
          </li>
          <li>
            Empaquelas en una bolsa o caja bien cerrada. Aceptamos un mínimo de
            X prendas por envio.
          </li>
          <li>
            Si vives en la GAM, puedes agendar una recolección de tus prendas
            por parte de nuestro equipo por una tarifa fija de 2000 colones,
            esta sera deducida de su monedero una vez se vendan sus prendas. O
            si así lo deseas, puedes dejar el paquete directamente en nuestras
            instalaciones. También aceptamos paquetes de fuera de la GAM a
            través de Correos de Costa Rica, en este caso la tarifa queda sujeta
            a Correos de Costa Rica.
          </li>
          <li>
            Una vez recibamos sus prendas, pasarán por un control de calidad. Ya
            aprobadas, nosotros las clasificamos, fotografiamos, las posteamos,
            les damos publicidad y nos encargamos de su entrega. Una vez
            vendidas, se depositará a su monedero virtual el porcentage
            correspondiente a la venta, el sabado siguiente a la venta. El cual
            podrás utilizar para comprar otras prendas en XXXXX, o bien,
            depositar en su cuenta bancaria.
          </li>
        </ol>
        <h1 className="mt-12 text-center text-3xl text-orange">
          Recuerde que la recolecta en la GAM tiene una tarifa fija de 2000
          colones que se cobrara de su monedero una vez las prendas se hayan
          vendido.
        </h1>
      </div>

      <div className="my-10 h-[50vh] bg-green px-32">
        <h1 className="pt-5  text-center text-3xl text-creme">
          Qué tipo de prendas aceptamos?
        </h1>

        <div className="mt-10 flex justify-between">
          <p className="w-[40%] text-center text-2xl text-creme">
            Aceptamos ropa y zapatos de marca de hombre y mujer, al igual que
            bolsos, carteras y lentes de sol. Las prendas tienen que estar en
            buen estado.
          </p>
          <p className="w-[40%] text-center text-2xl text-creme">
            No aceptamos ropa en mal estado, ropa interior, medias, anillos,
            collares o pulseras, vestidos de novia.
          </p>
        </div>
      </div>

      <div className="h-[70vh] px-5 md:px-32">
        {" "}
        <img src="Group 74.png" alt="" />{" "}
      </div>
    </div>
  );
};

export default Vende;
