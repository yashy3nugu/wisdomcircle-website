import { type AppType } from "next/app";

import { api } from "@/utils/api";
import { Poppins } from "next/font/google";

import "@/styles/globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${poppins.className}`}>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
