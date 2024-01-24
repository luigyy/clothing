import Image from "next/image";
import { ClipLoader } from "react-spinners";
export default function LoadingPage() {
  return (
    <div className=" absolute top-0 z-10 flex h-screen max-h-full w-[98vw] max-w-full flex-col  items-center justify-center gap-y-5 overflow-hidden bg-creme">
      <Image
        src="/logo-azul.png"
        width={150}
        height={150}
        alt="logo loading page"
      />

      <ClipLoader color="#93a571" size={40} />
    </div>
  );
}
