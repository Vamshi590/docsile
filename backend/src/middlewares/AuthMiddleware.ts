import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export default async function AuthMiddleware(c: Context, next: Next) {
  try {
   
    // Try getting the cookie both ways
    const token = getCookie(c, "auth");
    console.log("Token from getCookie:", token);


    if (!token) {
      return c.json({
        success: false,
        message: "No token found in cookies",
        redirect: "/auth/signup",
      }, 401);
    }

    try {
      // Verify the token
      const payload = await verify(token, c.env.JWT_SECRET);


      // Add user data to context
      c.set("user", payload);

      await next();
    } catch (verifyError) {
      console.log(verifyError);

      return c.json(
        {
          success: false,
          message: "Invalid token",
          redirect: "/auth/signup",
        },
        401
      );
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
        redirect: "/auth/signup",
      },
      500
    );
  }
}
