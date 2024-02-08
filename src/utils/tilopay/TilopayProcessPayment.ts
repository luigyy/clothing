interface ParamsType {
  apikey: string;
  apitoken: string;
  paymentData: {
    amount: string;
    billToEmail: string;
  };
}

interface ResponseType {
  type: string;
  hmtl: string;
  url: string;
}

export default async function TilopayProcessPayment({
  apikey,
  apitoken,
  paymentData,
}: ParamsType) {
  //
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `bearer ${apitoken}`);
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  const body = {
    redirect: "http://localhost:3000/checkout",
    key: apikey,
    amount: paymentData.amount,
    currency: "CRC",
    billToFirstName: "DEMO",
    billToLastName: "DEMO",
    billToAddress: "San Jose",
    billToAddress2: "Catedral",
    billToCity: "JS",
    billToState: "SJ",
    billToZipPostCode: "10061",
    billToCountry: "CR",
    billToTelephone: "88888888",
    billToEmail: paymentData.billToEmail,
    orderNumber: "1234",
    capture: "1",
    subscription: "0",
    platform: "api",
    returnData: "dXNlcl9pZD0xMg==",
    hashVersion: "V2",
  };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(body),
    redirect: "follow",
  };
  let response: ResponseType;
  try {
    const data = await fetch(
      "https://app.tilopay.com/api/v1/processPayment",
      requestOptions,
    );

    response = await data.json();
  } catch (err) {
    console.log(err);
    return null;
  }

  return response;
}
