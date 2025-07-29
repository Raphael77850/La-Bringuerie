import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const generateAccessToken = (admin: {
  id: number;
  email: string;
  role: string;
}) => {
  return jwt.sign(admin, process.env.JWT_SECRET || "votre_clé_secrète", {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (admin: {
  id: number;
  email: string;
  role: string;
}) => {
  return jwt.sign(
    admin,
    process.env.JWT_REFRESH_SECRET || "votre_refresh_secret",
    { expiresIn: "7d" },
  );
};

const refreshToken: RequestHandler = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token manquant" });
    return;
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "votre_refresh_secret",
    ) as { id: number; email: string; role: string };
    const newAccessToken = generateAccessToken(decoded);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token invalide" });
  }
};

export default { refreshToken, generateAccessToken, generateRefreshToken };
