import { NextPageWithLayout } from "next";
import CartLayout from "./layout";
import { UserLocation } from "../settings/location";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LocationConfirmation: NextPageWithLayout = () => {
  const router = useRouter();
  const { locationId } = router.query;
  const [selectedLocationId, setSelectedLocationId] = useState(locationId);

  useEffect(() => {
    setSelectedLocationId(locationId);
  }, [router.isReady]);

  const selectLocationHandler = (id: string) => {
    router.query.locationId = id;
    router.push(router);
    //
    setSelectedLocationId(id);
  };

  return (
    <div className="px-4">
      <UserLocation
        selectLocationFn={selectLocationHandler}
        selectedLocationId={
          Array.isArray(selectedLocationId)
            ? selectedLocationId[0]
            : selectedLocationId
        }
      />
    </div>
  );
};

LocationConfirmation.getLayout = (page) => <CartLayout>{page}</CartLayout>;

export default LocationConfirmation;
