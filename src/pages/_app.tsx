import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { Poppins } from "next/font/google";

import "@/styles/globals.css";
import Layout from "@/components/layouts/layout";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>WisdomCircle</title>

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${poppins.className}`}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
