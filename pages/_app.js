import { Suspense } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/helpers/index";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

import ErrorBoundary from "@/components/error-boundary";
import PrivateRoute from "@/components/private-route";
import Loader from "@/components/loader";

import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        {/* 화면 확대 차단 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          key="viewport"
        />
      </Head>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <SWRConfig
            value={{
              fetcher: fetcher,
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              suspense: true,
            }}
          >
            <AuthProvider>
              <PrivateRoute>
                <Component {...pageProps} />
              </PrivateRoute>
            </AuthProvider>
          </SWRConfig>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
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
