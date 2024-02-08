//validates hash from url redirect
import crypto from "crypto";

//get vars
type Params = {
  api_Key: string;
  api_user: string;
  api_password: string;
  //
  orderId: string;
  external_orden_id: string;
  amount: string;
  currency: string;
  responseCode: string;
  auth: string;
  email: string;
  orderHash: string;
};

export default function TilopayValidatePayment(params: Params) {
  const shared_secret = `${params.orderId}|${params.api_Key}|${params.api_password}`;

  const objectToHash = [
    ["api_Key", params.api_Key],
    ["api_user", params.api_user],
    ["orderId", params.orderId],
    ["external_orden_id", params.external_orden_id],
    [
      "amount",
      parseFloat(params.amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
      }),
    ],
    ["currency", params.currency],
    ["responseCode", params.responseCode],
    ["auth", params.auth],
    ["email", params.email],
  ];
  const hashOwnServer = crypto
    .createHmac("sha256", shared_secret)
    .update(new URLSearchParams(objectToHash).toString())
    .digest("hex");

  console.log(new URLSearchParams(objectToHash).toString());
  try {
    var hashesMatch = crypto.timingSafeEqual(
      Buffer.from(hashOwnServer),
      Buffer.from(params.orderHash),
    );
  } catch {
    return false;
  }

  if (hashesMatch) {
    return true;
  }

  console.log("hashes", hashOwnServer, params.orderHash);
  return false;
}
