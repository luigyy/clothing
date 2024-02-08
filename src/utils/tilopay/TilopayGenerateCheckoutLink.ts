import TilopayLogin from "./TilopayLogin";
import TilopayProcessPayment from "./TilopayProcessPayment";

export default async function TilopayGenerateCheckoutLink({
  apiuser,
  apikey,
  password,
  paymentData,
}: {
  apiuser: string;
  apikey: string;
  password: string;
  paymentData: {
    amount: string;
    billToEmail: string;
    orderId: string;
  };
}) {
  //generate token

  const loginResponse = await TilopayLogin({ apiuser, password });
  if (!loginResponse) return null;

  const accessToken = loginResponse.access_token;

  const result = await TilopayProcessPayment({
    apikey,
    apitoken: accessToken,
    paymentData,
  });

  if (!result) return null;

  //return checkout link
  return result.url;
}
