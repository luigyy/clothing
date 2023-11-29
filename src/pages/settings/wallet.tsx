import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";

const WalletComponent: NextPageWithLayout = () => {
  return (
    <div className="relative mx-auto my-16 aspect-[1.9] w-1/2 max-w-[600px] rounded-md border border-blue bg-blue">
      <h1 className="p-2 text-xl text-creme">Monedero virtual</h1>

      <div className="mt-5">
        <h1 className="text-center text-creme">Tu balance es</h1>
        <p className="text-center text-4xl font-bold text-creme">30.000</p>
      </div>

      <div className="absolute bottom-2 flex h-10  w-full gap-x-3 px-2 ">
        <button className="clickable-effect w-1/2 rounded-md bg-creme px-2 py-1 text-blue">
          Historial
        </button>
        <button className="clickable-effect w-1/2 rounded bg-green px-2 py-1">
          Retirar
        </button>
      </div>
    </div>
  );
};

WalletComponent.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default WalletComponent;
