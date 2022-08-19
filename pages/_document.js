import { Html, Head, Main } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      />
      <body>
        <Main />
      </body>
    </Html>
  );
}
