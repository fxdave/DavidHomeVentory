import jwt from "jsonwebtoken";
import {CONFIG} from "../../config";

export function createToken() {
  const ONE_YEAR = 365 * 24 * 60 * 60;
  return jwt.sign({}, CONFIG.JWT_SECRET, {
    expiresIn: ONE_YEAR,
  });
}

export function isTokenValid(token: string) {
  try {
    jwt.verify(token, CONFIG.JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}
