import cleanQueryParam from "~/utils/functions/cleanParamTypes";
import { api } from "~/utils/api";

/** checkout redirects to this page */
import { useRouter } from "next/router";

export default function CheckoutResult() {
  //
  const router = useRouter();
  let { code, auth, order, OrderHash, tpt } = router.query;
  // console.log(code, auth, order, OrderHash);

  //clean types string[] -> string of params
  code = cleanQueryParam(code);
  order = cleanQueryParam(order);
  OrderHash = cleanQueryParam(OrderHash);
  auth = cleanQueryParam(auth);
  tpt = cleanQueryParam(tpt);

  //check if url matches (url has not been modified)
  const { data: urlIsNotModified, isLoading } =
    api.payment.validateCheckoutUrl.useQuery({
      responseCode: code ?? "",
      auth: auth ?? "",
      externalOrderId: order ?? "",
      orderId: tpt ?? "",
      amount: "10000",
      email: "valverdejareth@gmail.com",
      orderHash: OrderHash ?? "",
    });

  //if url has been modified
  if (!urlIsNotModified && !isLoading) {
    return (
      <div className="flex h-[75vh] w-full items-center justify-center ">
        <div className="flex flex-col">
          <h1 className="text-center">
            <h1 className="text-red-500">Peligro:</h1> El URL ha sido modificado
          </h1>
          <p className="py-2 text-blue/80">
            Esto puede ser peligroso, ya que usamos datos de este para
            determinar el estado de su compra
          </p>
          <button onClick={() => router.back()} className="btn uppercase">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <div>Compra exitosa</div>;
}
