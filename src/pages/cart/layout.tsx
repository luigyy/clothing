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
  const linkLocation = api.orders.setOrderLocation.useMutation().mutateAsync;
  const { data: locationExists, isFetched } =
    api.location.checkLocationExists.useQuery({
      locationId: locationId ?? "",
    });

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

  const [cartTotal, setCartTotal] = useState(calculateTotal(data?.garments));

  //states
  const { data: checkoutLink } = api.payment.generateLink.useQuery({
    amount: cartTotal.toString(),
    email: sessionData?.user.email || "",
    orderId: data?.id || "",
  });

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
      () => linkLocation({ locationId, orderId: data?.id }),
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
    return await toast.promise(
      linkTotalPrice.mutateAsync({ orderId: data?.id ?? "", total: cartTotal }),
      {
        success: "Se añadio el precio total de la orden",
        pending: "Procesando el precio",
        error: "Hubo un error al procesar el precio",
      },
    );
  };

  const onClickHandler = async () => {
    if (path === "/cart") {
      router.push("/cart/location-confirmation");
    }
    if (path === "/cart/location-confirmation") {
      //check if location was linked successfully
      const result = await linkLocationToOrder();
      if (!result) return;

      router.push("/cart/data-confirmation");
    }
    if (path === "/cart/data-confirmation") {
      await linkTotalPriceToOrder();
      const isComplete = checkUserDataIsComplete();
      if (!isComplete) return;

      redirectToCheckoutLink();
    }
  };

  useEffect(() => {
    setCartTotal(calculateTotal(data?.garments));
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
              {path !== "/cart/data-confirmation" ? "Siguiente" : "Ir a pagar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartLayout;
