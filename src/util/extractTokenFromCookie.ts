export const extractTokenFromCookie = (
  cookie: string,
  key: string
): string | undefined => {
  const cookieParts = cookie.split("; ");
  let token: string | undefined;

  for (const part of cookieParts) {
    if (part.startsWith(key + "=")) {
      token = part.replace(key + "=", "");
      break;
    }
  }

  return token;
};
