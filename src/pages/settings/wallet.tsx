import { NextPageWithLayout } from "next";
import SettingsLayout from "./layout";
import { api } from "~/utils/api";

const WalletComponent: NextPageWithLayout = () => {
  const { data: userData, isLoading } = api.users.getCurrentUser.useQuery();
  return (
    <div className="">
      <h1 className="mb-5 border-b pb-5 text-2xl">Monedero</h1>
      {/* total balance  */}
      <div className="rounded-md border bg-blue  p-5 text-creme">
        <h1 className="text-lg font-semibold">Balance total</h1>

        <h1 className="py-7 text-4xl font-bold">
          {isLoading ? "Cargando monedero..." : `₡${userData?.walletCredits}`}
        </h1>
      </div>
    </div>
  );
};

WalletComponent.getLayout = (page) => <SettingsLayout>{page}</SettingsLayout>;

export default WalletComponent;
