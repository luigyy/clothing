import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import TilopayGenerateCheckoutLink from "~/utils/tilopay/TilopayGenerateCheckoutLink";

export const paymentRouter = createTRPCRouter({
  generateLink: protectedProcedure.query(async () => {
    const apikey = env.TILOPAY_APIKEY;
    const apiuser = env.TILOPAY_APIUSER;
    const password = env.TILOPAY_PASSWORD;
    //
    console.log(apikey, apiuser);
    //
    return await TilopayGenerateCheckoutLink({
      apikey,
      apiuser,
      password,
    });
  }),
});
