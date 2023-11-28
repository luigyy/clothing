import { NextComponentType } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";

function withAdminAuth(Component: NextComponentType) {
  return function WithAdminAuth() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const getLayout = Component.getLayout || ((page) => page);

    // Add your authentication logic here
    const {
      data: isAuth,
      isLoading,
      isFetched,
    } = api.admin.checkAdminRole.useQuery();

    // Redirect to login page if not authenticated
    useEffect(() => {
      if (!isAuth && isFetched) {
        router.push("/");
      }
    }, [isFetched]);

    //
    if (isLoading) {
      return <div>loading...</div>;
    }
    return status === "authenticated" && getLayout(<Component />);
  };
}

export default withAdminAuth;
