import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Button from "~/components/Button";
import Navbar from "~/components/Navbar";
import { BsCheckCircle, BsArrowReturnLeft } from "react-icons/bs";
import { GiSeaTurtle } from "react-icons/gi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const GarmentCategoryCard = ({
  image_link,
  label,
  link,
}: {
  image_link: string;
  label: string;
  link: string;
}) => {
  return (
    <Link
      href={link}
      className="relative aspect-[0.8] w-44  transition-transform duration-300 hover:scale-[103%]"
    >
      <img src={image_link} alt="" />
      <h1 className="absolute -bottom-0 left-1/2 w-full -translate-x-1/2 bg-blue text-center text-lg text-creme ">
        {label}
      </h1>
    </Link>
  );
};

const SquaredBanner = ({
  image,
  title,
  text,
  link,
}: {
  image: string;
  title: string;
  text: string;
  link: string;
}) => {
  return (
    <Link
      href="#_"
      className="relative aspect-[1.2] w-[33%] overflow-hidden transition-all duration-300 hover:ring-4 hover:ring-orange "
    >
      {/* text  */}
      <div className=" absolute  left-1/2 top-1/2 w-[60%] -translate-x-1/2    bg-black  bg-opacity-20 p-3">
        <h1 className="mb-2 text-center   text-creme">{title}</h1>
        <p className="text-center text-lg text-creme">{text}</p>
      </div>
      {/*end text  */}
      <img src={image} className="w-full " alt="" />
    </Link>
  );
};

export default function Home() {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3200,
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="overflow-x-hidden">
        <div className=" relative mx-32 h-[35vh] overflow-hidden">
          {/* *** */}
          {/* first section  */}
          <div className=" absolute right-5 top-1/2 -translate-y-1/2  ">
            <h1 className="text-right font-fancy text-4xl font-semibold text-creme">
              Atuendo de verano
            </h1>
            <p className="text-right font-semibold text-creme">01/01-28/01</p>
            <h1 className="text-right font-fancy text-5xl font-semibold text-creme">
              hasta{" "}
              <span className="font-fancy font-semibold text-orange">
                70% OFF
              </span>
            </h1>
          </div>
          {/* *** */}
          {/* end first section  */}

          {/* bg image  */}
          <img src="hero-image.jpg" className="relative -z-10 w-full" alt="" />
        </div>
        {/* *** */}
        {/* indicadores  */}
        <div className="my-4 flex  justify-between px-32">
          <div className="flex flex-col  justify-center">
            <BsCheckCircle className="mx-auto text-2xl text-orange" />
            <h1 className="mt-1 text-center">Calidad Garantizada</h1>
            <p className="mt-2 w-40 text-center text-sm ">
              Nuestra ropa, revisada meticulosamente, garantiza calidad y estado
              óptimo.
            </p>
          </div>
          <div className="flex flex-col  justify-center">
            <BsArrowReturnLeft className="mx-auto text-2xl text-orange" />
            <h1 className="mt-1 text-center ">Devolución gratuita</h1>
            <p className="mt-2 w-40 text-center text-sm">
              Llevatela y pruebatela. Si no cumple tus expectativas, estamos
              aquí para gestionar su devolución.
            </p>
          </div>
          <div className="flex flex-col  justify-center">
            <GiSeaTurtle className="mx-auto text-2xl text-orange" />
            <h1 className="mt-1 text-center ">Reduzca su impacto</h1>
            <p className="mt-2 w-40 text-center text-sm">
              Una prenda puede llegar a consumir hasta 3000 litros de agua.
              Ahorra y ayuda!
            </p>
          </div>
        </div>
        {/*end indicadores  */}
        {/* *** */}

        {/* *** */}
        {/* second section  */}
        <div className="mb-10 flex flex-wrap justify-between  gap-y-3 px-32  ">
          <SquaredBanner
            image="dress-homepage-image.png"
            link="#_"
            title="hasta 70% en vestidos"
            text="Encuentre lo mas trendy"
          />{" "}
          <SquaredBanner
            image="barbie-image.png"
            link="#_"
            title="Be a Barbie Girl"
            text="Prenda barbie a partir de 2500"
          />{" "}
          <SquaredBanner
            image="vintage-image.png"
            link="#_"
            title="Stay Vintage"
            text="Encuentre su estilo"
          />
        </div>
        {/* end second section  */}
        {/* *** */}

        {/* review section  */}
        {/* *** */}
        <div className="relative mb-10 h-32 w-full bg-green">
          <div className="absolute left-1/2 top-1/2 inline-block  -translate-x-1/2 -translate-y-1/2  items-center justify-center ">
            <h1 className=" text-center text-2xl text-blue">
              “Me registré en Carei y sin ningun esfuerzo estaba vendiendo toda
              la ropa que no usaba”
            </h1>
            <p className=" mt-2 text-center text-blue">Maria L.</p>
          </div>
        </div>
        {/* end review section  */}
        {/* *** */}

        {/* *** */}
        {/* categories  */}
        <div className="my-10 flex justify-between px-32">
          <GarmentCategoryCard
            label="Camisas"
            image_link="/shirt-image.jpg"
            link="/garments?category=camisas"
          />
          <GarmentCategoryCard
            label="Jeans"
            image_link="/jeans-image.jpg"
            link="/garments?category=jeans"
          />
          <GarmentCategoryCard
            label="Vestidos"
            image_link="/dress-image.jpg"
            link="/garments?category=vestidos"
          />
          <GarmentCategoryCard
            label="Zapatos"
            image_link="shoes-image.jpg"
            link="/garments?category=zapatos"
          />
          <GarmentCategoryCard
            label="Camisetas"
            image_link="t-shirt-image.jpg"
            link="/garments?category=camisas"
          />
        </div>
        {/* end categories  */}
        {/* *** */}

        {/* carousel*/}
        {/* *** */}
        <div className="relative my-10 px-32 ">
          <Slider className="mx-auto   " {...carouselSettings}>
            <div className="h-72 w-full bg-orange">
              <h3>1</h3>
            </div>{" "}
            <div className="h-72 w-full bg-green">
              <h3>1</h3>
            </div>{" "}
            <div className="h-72 w-full bg-blue">
              <h3>1</h3>
            </div>
          </Slider>
        </div>
      </main>
    </>
  );
}
