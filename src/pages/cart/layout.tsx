import { Garment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ItemRow } from "~/components/Navbar";
import { api } from "~/utils/api";

export const requiredUserDataIsComplete = ({
  name,
  email,
  phoneNumber,
}: {
  name: string;
  email: string;
  phoneNumber: string;
}) => {
  if (!(name && email && phoneNumber)) {
    return false;
  }
  return true;
};

/**
 *
 * @param garments list of garments to pay
 * @returns total amount to pay
 */
export function calculateTotal(garments: Garment[] | null | undefined) {
  if (!garments) return 0;

  let total = 0;
  garments.forEach((garment) => {
    total += garment.current_price;
  });
  return total;
}

const CartLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();

  const locationId = Array.isArray(router.query.locationId)
    ? router.query.locationId[0]
    : router.query.locationId;

  //

  const { data: sessionData } = useSession();
  const { data, isLoading } = api.orders.getCurrentUserCart.useQuery();
  const { data: userData } = api.users.getCurrentUser.useQuery();
  const linkLocation = api.orders.setOrderLocation.useMutation();
  const { data: locationExists, isFetched } =
    api.location.checkLocationExists.useQuery({
      locationId: locationId ?? "",
    });

  const ORDER_ID = data?.id;
  const USER_EMAIL = sessionData?.user.email;

  const linkTotalPrice = api.orders.setOrderPrice.useMutation();
  // toasts

  const noSelectedLocationToast = () =>
    toast("Tienes que seleccionar una ubicación", { type: "error" });
  const errorGeneratingCheckoutLinkToast = () =>
    toast("Error al dirigirse a la pagina de pago", { type: "error" });

  const requiredUserDataIsNotComplete = () =>
    toast("Los datos del usuario están incompletos. Complete su perfíl", {
      type: "error",
    });

  //

  const [cartSubtotal, setcartSubtotal] = useState(
    calculateTotal(data?.garments),
  );
  const [useCredits, setUseCredits] = useState(false);
  const [creditsAmount, setCreditsAmount] = useState(
    userData?.walletCredits ?? 0,
  );
  const [cartTotal, setcartTotal] = useState(cartSubtotal);

  //states
  const { data: checkoutLink } = api.payment.generateLink.useQuery({
    amount: cartTotal.toString(),
    email: USER_EMAIL ?? "",
    orderId: ORDER_ID ?? "",
  });

  /**redirects to checkout */
  const redirectToCheckoutLink = async () => {
    const priceIsCorrect = await linkTotalPriceToOrder();
    //price not correct, some number has been modified
    if (!priceIsCorrect) {
      toast("El precio es incorrecto. Recargar página", { type: "error" });
      return;
    } else {
      toast("Se guardó el precio de la orden", { type: "success" });
    }

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
      noSelectedLocationToast();
      return null;
    }
    //check location exists
    if (!locationExists) {
      toast("Ubicación incorrecta. Crea una nueva ubicación", {
        type: "error",
      });
      return null;
    }

    return await toast.promise(
      () => linkLocation.mutateAsync({ locationId, orderId: data?.id }),
      {
        success: "Ubicación guardada con éxito",
        pending: "Guardadon ubicación del pedido",
        error: "Hubo un error al guardar la ubicación del pedido",
      },
    );
  };

  /**
   * checks user profile contains required data before going to checkout
   */
  const checkUserDataIsComplete = () => {
    if (
      !requiredUserDataIsComplete({
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        phoneNumber: userData?.phoneNumber ?? "",
      })
    ) {
      requiredUserDataIsNotComplete();
      return false;
    }
    return true;
  };

  const linkTotalPriceToOrder = async () => {
    const result = await toast.promise(
      linkTotalPrice.mutateAsync({
        orderId: data?.id ?? "",
        total: cartSubtotal,
        //if user not using their credits, set discount amount to 0.
        discountAmount: useCredits ? creditsAmount : 0,
      }),
      {
        pending: "Procesando el precio",
        error: "Hubo un error al procesar el precio",
      },
    );
    return result;
  };

  const onClickHandler = async () => {
    if (path === "/cart") {
      router.push("/cart/location-confirmation");
    }
    if (path === "/cart/location-confirmation") {
      //check if already loading
      if (linkLocation.isLoading) {
        return;
      }

      //check if location was linked successfully
      const result = await linkLocationToOrder();
      if (!result) return;

      router.push("/cart/data-confirmation");
    }
    if (path === "/cart/data-confirmation") {
      //check if already pressed button
      if (linkTotalPrice.isLoading) {
        return;
      }

      //check user data is complete
      const isComplete = checkUserDataIsComplete();
      if (!isComplete) return;

      redirectToCheckoutLink();
    }
  };

  useEffect(() => {
    setcartSubtotal(calculateTotal(data?.garments));
  }, [data]);

  useEffect(() => {
    if (!isFetched) {
      return;
    }

    //if location does not exists, remove locationId param from url
    if (!locationExists) {
      router.query.locationId = [];
      router.push(router);
    }
  }, [isFetched]);

  //useCredits: update total amount to apply disccount
  useEffect(() => {
    if (useCredits) {
      return setcartTotal(cartSubtotal - creditsAmount);
    }
    setcartTotal(cartSubtotal);
  }, [useCredits]);

  useEffect(() => {
    setcartTotal(cartSubtotal);
  }, [cartSubtotal]);

  useEffect(() => {
    if (userData) {
      setCreditsAmount(userData?.walletCredits);
    }
  }, [userData]);

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
            {creditsAmount === 0 ? null : (
              <div className="mt-3  flex items-center justify-between border-opacity-25 py-2 pl-1">
                <button
                  onClick={() => setUseCredits(!useCredits)}
                  className="btn [&&]:border-green  [&&]:bg-green [&&]:text-xs"
                >
                  {useCredits ? "No usar creditos" : "Usar creditos"}
                </button>
                <div className="flex items-center gap-x-3">
                  <p className="text-sm text-blue/80">{`₡${creditsAmount.toLocaleString()}`}</p>
                </div>
              </div>
            )}
            {useCredits ? (
              <>
                <div className=" flex justify-between border-t border-orange border-opacity-25 pl-1 pt-2  ">
                  <h1 className="text-xs font-semibold">Subtotal</h1>
                  <p className="text-xs font-semibold text-blue/80">{`₡${cartSubtotal.toLocaleString()}`}</p>
                </div>

                <div className=" flex justify-between   border-opacity-25 pl-1  ">
                  <h1 className="text-xs font-semibold">Descuento</h1>
                  <p className="text-xs font-semibold text-red-500/80">{`-₡${creditsAmount.toLocaleString()}`}</p>
                </div>
              </>
            ) : null}

            <div className=" flex justify-between  border-opacity-25  pl-1 pt-1 ">
              <h1>Total</h1>
              <p className="text-sm font-semibold">{`₡${cartTotal.toLocaleString()}`}</p>
            </div>
            <button
              onClick={onClickHandler}
              className="btn my-4 block w-full border-2  border-red-500 text-center "
            >
              {path !== "/cart/data-confirmation" ? "Siguiente" : "Ir a pagar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartLayout;
