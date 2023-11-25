import React, { useEffect } from "react";
import { withAdminAuth } from "./Checkauth";

const Index = ({}) => {
  // const router = useRouter();
  // const { data: userIsAdmin, isLoading } = api.admin.checkAdminRole.useQuery();

  // useEffect(() => {
  //   if (!userIsAdmin) router.push("/");
  // }, [isLoading]);
  // if (isLoading) return <div>loading</div>;

  //
  return <div> admin page</div>;
};

export default withAdminAuth(Index);
