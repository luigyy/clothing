import cleanQueryParam from "~/utils/functions/cleanParamTypes";
import { api } from "~/utils/api";

/** checkout redirects to this page */
import { useRouter } from "next/router";
import LoadingPage from "~/components/LoadingPage";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ReturnDataType } from "~/types";

export default function CheckoutResult() {
  const utils = api.useContext();

  const updateOrderToAlreadyPaid =
    api.orders.setOrderToAlreadyPaid.useMutation();
  //
  const router = useRouter();
  const { data: cartData } = api.orders.getCurrentUserCart.useQuery();
  let { code, auth, order, OrderHash, tpt, description, wp_cancel } =
    router.query;

  //clean types string[] -> string of params
  wp_cancel = cleanQueryParam(wp_cancel);
  code = cleanQueryParam(code);
  order = cleanQueryParam(order);
  OrderHash = cleanQueryParam(OrderHash);
  auth = cleanQueryParam(auth);
  tpt = cleanQueryParam(tpt);
  description = cleanQueryParam(description);

  //check if url matches (url has not been modified)
  const { data: urlIsNotModified, isLoading } =
    api.payment.validateCheckoutUrl.useQuery(
      {
        responseCode: code ?? "",
        auth: auth ?? "",
        externalOrderId: order ?? "",
        orderId: tpt ?? "",
        amount: cartData?.purchaseTotal?.toString() ?? "",
        email: cartData?.user.email ?? "",
        orderHash: OrderHash ?? "",
      },
      {
        onSuccess: (urlNotModified) => {
          //update order data if valid purchase
          console.log(urlNotModified);
          if (urlNotModified && code === "1") {
            toast.promise(
              updateOrderToAlreadyPaid.mutateAsync(
                {
                  orderId: (Array.isArray(order) ? order[0] : order) ?? "",
                  creditsUsed: cartData?.creditsUsed ?? 0,
                },
                {
                  onSuccess: () => {
                    utils.orders.getCurrentUserCart.setData(undefined, null);
                  },
                },
              ),
              {
                success: "Orden procesada",
                pending: "Procesando order",
                error: "Orden no pudo ser procesada",
              },
            );
          }
        },
      },
    );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (wp_cancel && wp_cancel === "yes") {
    return (
      <div className="flex h-[75vh] w-full items-center justify-center ">
        <div className="flex flex-col">
          <h1 className="py-3 text-center">Pedido cancelado</h1>

          <button
            onClick={() => router.push("/cart")}
            className="btn uppercase"
          >
            Volver al carrito
          </button>
        </div>
      </div>
    );
  }

  //if url has been modified
  if (!urlIsNotModified && !isLoading && cartData) {
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

  if (code !== "1") {
    return (
      <div className="flex h-[75vh] w-full items-center justify-center">
        <div className="flex flex-col">
          <h1 className="py-3 text-center text-red-500">
            No se pudo tramitar su compra
          </h1>
          <p>{description}</p>
          <p className="py-2 text-center text-sm text-blue/80">
            Hubo un error al tramitar su compra
          </p>
          <button
            onClick={() => router.push("/cart")}
            className="btn my-3 uppercase"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[75vh] w-full items-center justify-center">
      <div className="flex flex-col">
        <h1 className="py-3 text-center text-green">La compra fue exitosa </h1>
        <p className="text-center">{description}</p>
        <p className="py-2 text-center text-sm text-blue/80">
          Gracias por comprar en Carei
        </p>
        <button
          onClick={() => router.push("/garments")}
          className="btn my-3 uppercase"
        >
          Seguir viendo
        </button>
      </div>
    </div>
  );
}
