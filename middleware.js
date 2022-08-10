import { NextResponse } from "next/server";

export const config = {
  matcher: ["/auth/:path*", "/qna/edit/:path*", "/qna/add"],
};

export async function middleware(req) {
  const token = req.cookies.get("token");
  const pathname = req.nextUrl.pathname;

  // 로그인 안한 사용자 -> protected 페이지 접속 -> 로그인 페이지로 redirect
  // /qna/edit/:id, /qna/add
  if (!token && pathname.includes("qna")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 로그인한 사용자 -> auth 관련 페이지 접속 -> 메인 페이지로 redirect
  // /auth/*
  if (token && pathname.includes("auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
