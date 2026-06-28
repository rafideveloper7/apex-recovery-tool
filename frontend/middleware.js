import { NextResponse } from "next/server";

const publicRoutes = ["/auth", "/admin", "/admin/dashboard", "/api"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.split(" ")[1];
  
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};