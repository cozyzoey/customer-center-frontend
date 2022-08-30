import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";

export default function PrivateRoute({ children }) {
  const router = useRouter();
  const redirect = router.query?.redirect || "/";
  const { token } = useContext(AuthContext);

  const protectedRoutes = ["/qna/edit", "/qna/add"];

  const pathIsProtected = protectedRoutes.some((protectedRoute) =>
    router.pathname.includes(protectedRoute)
  );

  useEffect(() => {
    if (!token && pathIsProtected) {
      router.replace(`/auth/login?redirect=${router.pathname}`);
    } else if (token && router.pathname.includes("/auth")) {
      // 인증된 사용자가 auth 관련 페이지 진입할 경우
      router.replace(redirect);
    }
  }, [token, router.pathname]);

  return children;
}
