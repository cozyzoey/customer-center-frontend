import { useEffect, useState } from "react";
import { getCookie, hasCookie } from "cookies-next";

export default function useToken() {
  const [token, setToken] = useState("");

  useEffect(() => {
    hasCookie("token") && setToken(getCookie("token"));
  }, []);

  return token;
}
