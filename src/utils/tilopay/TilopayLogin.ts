interface ParamsType {
  apiuser: string;
  password: string;
}

interface DataReturnType {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 *
 * @param apiuser Api user from tilopay checkout dashboard
 * @param password Api password from tilopay checkout dashboard
 * @returns an object containing the access token to be able to use other tilopay functionalities
 */
export default async function TilopayLogin({ apiuser, password }: ParamsType) {
  //
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const body = {
    apiuser: apiuser,
    password: password,
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: "follow",
  };

  let response: DataReturnType;
  try {
    const data = await fetch(
      "https://app.tilopay.com/api/v1/login",
      requestOptions,
    );
    response = await data.json();
  } catch (err) {
    console.log(err);
    return null;
  }
  return { access_token: response.access_token };
}
