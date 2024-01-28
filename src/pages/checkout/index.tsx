import cleanQueryParam from "~/utils/functions/cleanParamTypes";

/** checkout redirects to this page */
import { useRouter } from "next/router";

export default function CheckoutResult() {
  const router = useRouter();
  let { code } = router.query;

  //clean params
  code = cleanQueryParam(code);

  return <div>{code === "1" ? "success" : "failed"}</div>;
}
