import TilopayLogin from "./TilopayLogin";
import TilopayProcessPayment from "./TilopayProcessPayment";
import { env } from "~/env.mjs";

const apiuser = env.NEXT_PUBLIC_TILOPAY_APIUSER;
const apikey = env.NEXT_PUBLIC_TILOPAY_APIKEY;
const password = env.NEXT_PUBLIC_TILOPAY_PASSWORD;

console.log(apiuser, apikey);

export default async function TilopayGenerateCheckoutLink() {
  //generate token

  const loginResponse = await TilopayLogin({ apiuser, password });
  if (!loginResponse) return null;

  const accessToken = loginResponse.access_token;

  const result = await TilopayProcessPayment({ apikey, apitoken: accessToken });

  if (!result) return null;

  //return checkout link
  return result.url;
}
