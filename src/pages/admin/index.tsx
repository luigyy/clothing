import React from "react";
import withAdminAuth from "./CheckAdminAuth";
import { NextPageWithLayout } from "next";
import Layout from "./layout";

const Index: NextPageWithLayout = ({}) => {
  return <div>my test</div>;
};

Index.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;

export default withAdminAuth(Index);
