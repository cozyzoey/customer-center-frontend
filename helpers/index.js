import cookie from "cookie";

export function parseCookies(req) {
  return cookie.parse(req ? req.headers.cookie || "" : "");
}

export function fetcher(...args) {
  return fetch(...args).then((res) => res.json());
}
