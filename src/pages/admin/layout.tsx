import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* sidebar */}
      <aside className="h-screen w-40 bg-blue px-5 py-5">
        <h1 className="text-xl text-creme">Admin</h1>
        <ol className="flex flex-col space-y-2 py-5 ">
          <li className="font-medium tracking-tight text-creme">test</li>
          <li className="font-medium tracking-tight text-creme">test</li>
          <li className="font-medium tracking-tight text-creme">test</li>
        </ol>
      </aside>
      <div>{children}</div>
    </div>
  );
}
