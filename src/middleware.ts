import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Manage route protection
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Device detection
    // const userAgentHeader = req.headers.get('user-agent');
    // const isMobileOrTablet =
    //   userAgentHeader && /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentHeader);

    //   console.log("userAgentHeader",userAgentHeader)
    //   console.log("isMobileOrTablet",isMobileOrTablet)

    // Redirect mobile and tablet users to the "NotSupported" page
    // if (isMobileOrTablet && (isLoginPage || isAccessingSensitiveRoute) ) {
    //   return NextResponse.redirect(new URL('/not-supported', req.url));
    // }

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matchter: ["/", "/login", "/dashboard/:path*"],
};
