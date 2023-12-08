import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Antonio, Nunito } from "next/font/google";
import { Racing_Sans_One } from "next/font/google";
import { Poppins } from "next/font/google";
import Navbar from "~/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const quicksand = Quicksand({
//   subsets: ["latin"],
//   variable: "--font-quicksand",
//   weight: ["400"],
// });

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-title",
});

const poppings = Poppins({
  subsets: ["latin"],
  variable: "--font-text",
  weight: ["400"],
});
// const antonio = Antonio({
//   subsets: ["latin"],
//   variable: "--font-title",
// });

const racing = Racing_Sans_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-fancy",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session}>
      <main
        className={`${nunito.variable} ${poppings.variable} ${racing.variable} mx-auto max-w-7xl `}
      >
        <Navbar />
        {getLayout(<Component {...pageProps} />)}
        <ToastContainer />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
