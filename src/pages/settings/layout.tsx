import Link from "next/link";
import { usePathname } from "next/navigation";

const SideButton = ({
  title,
  buttonPath,
  currentPath,
}: {
  title: string;
  buttonPath: string;
  currentPath: string;
}) => {
  return (
    <Link
      href={buttonPath}
      className={`${
        currentPath === buttonPath ? "bg-orange/60" : null
      } rounded  px-3 py-2 text-sm font-medium tracking-tight`}
    >
      {title}
    </Link>
  );
};

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  return (
    <div className="px-10 py-8">
      <h1 className=" text-2xl tracking-tight">Configuración</h1>
      <hr className="mt-6" />
      <div className="sticky top-0 my-3 flex  ">
        <aside className="sticky top-0 float-left flex h-[80vh] w-40 flex-col space-y-6 py-2  ">
          <SideButton
            buttonPath="/settings"
            currentPath={path || ""}
            title="Perfil"
          />
          <SideButton
            buttonPath="/settings/location"
            currentPath={path || ""}
            title="Ubicación"
          />
          <SideButton
            buttonPath="/settings/wallet"
            currentPath={path || ""}
            title="Monedero"
          />
        </aside>

        <div className="ml-7 w-2/3 max-w-2xl   ">{children}</div>
      </div>
    </div>
  );
};
export default SettingsLayout;
