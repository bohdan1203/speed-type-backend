import { CookieOptions } from "express";

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  maxAge: 3600000 * 8, // Expires in 8 hours
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".onrender.com",
};
