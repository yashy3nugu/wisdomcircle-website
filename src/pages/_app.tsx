import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { Poppins } from "next/font/google";

import "@/styles/globals.css";
import Layout from "@/components/layouts/layout";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {

  

  return (
    <div className={`${poppins.className}`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster />
    </div>
  );
};

export default api.withTRPC(MyApp);
