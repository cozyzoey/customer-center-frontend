import { SWRConfig } from "swr";
import { fetcher } from "@/helpers/index";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader";
import { Suspense } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <SWRConfig
          value={{
            fetcher: fetcher,
            suspense: true,
            revalidateIfStale: false,
            revalidateOnFocus: false,
          }}
        >
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </SWRConfig>
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default MyApp;
