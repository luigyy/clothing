import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex">
      {/* sidebar */}
      <aside className="sticky top-0 h-screen w-48 border-r border-blue/5  px-7  py-5 ">
        <h1 className="text-xl">Admin</h1>
        <ol className="flex flex-col space-y-6 py-5 ">
          <SideButton
            buttonPath="/admin"
            currentPath={path ?? ""}
            title="Dashboard"
          />
          <SideButton
            buttonPath="/admin/create-garment"
            currentPath={path ?? ""}
            title="Crear prenda"
          />
        </ol>
      </aside>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
