import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import TilopayGenerateCheckoutLink from "~/utils/tilopay/TilopayGenerateCheckoutLink";

export const paymentRouter = createTRPCRouter({
  generateLink: protectedProcedure
    .input(z.object({ email: z.string(), amount: z.string() }))
    .query(async ({ input }) => {
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
        paymentData: {
          amount: input.amount,
          billToEmail: input.email,
        },
      });
    }),
});
