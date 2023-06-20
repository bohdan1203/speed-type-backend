import jwt from "jsonwebtoken";

export function generateTokens(
  userId: string,
  username: string,
  accessSecret: string,
  accessExpiresIn: string,
  refreshSecret?: string,
  refreshExpiresIn?: string
): { accessToken: string; refreshToken: string | null } {
  const accessToken = jwt.sign(
    {
      userId,
      username,
    },
    accessSecret,
    { expiresIn: accessExpiresIn }
  );

  let refreshToken = null;

  if (refreshSecret && refreshExpiresIn) {
    refreshToken = jwt.sign(
      {
        userId,
        username,
      },
      refreshSecret,
      { expiresIn: refreshExpiresIn }
    );
  }

  return { accessToken, refreshToken };
}
