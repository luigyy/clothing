import { Garment } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ItemRow } from "~/components/Navbar";
import { api } from "~/utils/api";

const CartLayout = ({ children }: { children: React.ReactNode }) => {
  // toasts

  const noSelectedLocationToast = () =>
    toast("Tienes que seleccionar una ubicación", { type: "error" });
  const errorGeneratingCheckoutLinkToast = () =>
    toast("Error al dirigirse a la pagina de pago", { type: "error" });
  //
  const router = useRouter();

  const locationId = Array.isArray(router.query.locationId)
    ? router.query.locationId[0]
    : router.query.locationId;

  //

  const path = usePathname();
  const { data, isLoading } = api.orders.getCurrentUserCart.useQuery();
  const linkLocation = api.orders.linkLocationToOrder.useMutation().mutateAsync;
  const { data: checkoutLink } = api.payment.generateLink.useQuery();

  const [cartTotal, setCartTotal] = useState(calculateTotal(data?.garments));

  /**
   *
   * @param garments list of garments to pay
   * @returns total amount to pay
   */
  function calculateTotal(garments: Garment[] | null | undefined) {
    if (!garments) return 0;

    let total = 0;
    garments.forEach((garment) => {
      total += garment.current_price;
    });
    return total;
  }

  /**redirects to checkout */
  const redirectToCheckoutLink = async () => {
    if (!checkoutLink) return errorGeneratingCheckoutLinkToast();
    router.push(checkoutLink);
  };

  /**
   * when in location-confirmation page, not only will you want to go to the another page, but you wanna
   * link the recently selected location to the order
   * @returns
   */
  const linkLocationToOrder = async () => {
    if (!(data?.id && locationId)) {
      return noSelectedLocationToast();
    }

    toast.promise(linkLocation({ locationId, orderId: data?.id }), {
      success: "Ubicación guardada con éxito",
      pending: "Guardadon ubicación del pedido",
      error: "Hubo un error al guardar la ubicación del pedido",
    });
  };

  const onClickHandler = () => {
    if (path === "/cart") {
      router.push("/cart/location-confirmation");
    }

    if (path === "/cart/location-confirmation") {
      linkLocationToOrder();
      redirectToCheckoutLink();
    }
  };

  useEffect(() => {
    setCartTotal(calculateTotal(data?.garments));
  }, [data]);

  //loading states
  if (!data?.garments.length && isLoading === false)
    return <div>no orders!</div>;

  return (
    <>
      <div className="flex px-4 pb-10">
        <div className="w-[65%]">{children}</div>
        <div className="w-[35%]">
          <div className="sticky  top-3  mx-auto mt-3 min-h-[200px] w-[85%] rounded-lg  ">
            {data?.garments.map((garment) => (
              <ItemRow
                key={garment.id}
                brand={garment.brand}
                current_price={garment.current_price}
                garmentId={garment.id}
                genre={garment.genre}
                size={garment.size}
              />
            ))}

            <div className="mt-3  flex justify-between  border-t border-orange border-opacity-25 px-3 pt-3">
              <h1>Total</h1>
              <p className="text-sm font-semibold">{`₡${cartTotal.toLocaleString()}`}</p>
            </div>
            <button
              onClick={onClickHandler}
              className="btn my-4 block w-full border-2  border-red-500 text-center "
            >
              {path === "/cart" ? "Siguiente" : "Ir a pagar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartLayout;
