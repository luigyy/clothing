import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Antonio, Quicksand } from "next/font/google";
import { Racing_Sans_One } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400"],
});

const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
});

const racing = Racing_Sans_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-racing",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <main
        className={`${quicksand.variable} ${antonio.variable} ${racing.variable} `}
      >
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
