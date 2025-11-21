export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/budget/:path*",
    "/subscriptions/:path*",
    "/goals/:path*",
    "/coach/:path*",
    "/settings/:path*",
  ]
}
