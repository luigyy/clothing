import { z } from "zod";
import { env } from "~/env.mjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import TilopayGenerateCheckoutLink from "~/utils/tilopay/TilopayGenerateCheckoutLink";
import TilopayValidatePayment from "~/utils/tilopay/TilopayValidatePayment";

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
  /**
   * if false, url is invalid.
   */
  validateCheckoutUrl: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        externalOrderId: z.string(),
        responseCode: z.string(),
        auth: z.string(),
        amount: z.string(),
        email: z.string(),
        orderHash: z.string(),
      }),
    )
    .query(({ input }) => {
      const result = TilopayValidatePayment({
        api_Key: env.TILOPAY_APIKEY,
        api_user: env.TILOPAY_APIUSER,
        api_password: env.TILOPAY_PASSWORD,
        amount: input.amount ?? "",
        auth: input.auth ?? "",
        currency: "CRC",
        email: input.email ?? "",
        external_orden_id: input.externalOrderId ?? "",
        orderHash: input.orderHash ?? "",
        orderId: input.orderId ?? "",
        responseCode: input.responseCode ?? "",
      });

      //incorrect or modified url, invalid payment
      return result;
    }),
});
