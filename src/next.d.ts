import type { NextPage } from "next";
import type { NextComponentType } from "next/dist/next-server/lib/utils";

declare module "next" {
  export declare type NextPageWithLayout<P = Object, IP = P> = NextPage<
    P,
    IP
  > & {
    getLayout: (component: NextComponentType) => JSX.Element;
  };
}
