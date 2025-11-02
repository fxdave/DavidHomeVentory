import jwt from "jsonwebtoken";
import {CONFIG} from "../../config";

export function createToken() {
  return jwt.sign({}, CONFIG.JWT_SECRET, {
    expiresIn: "365 days",
  });
}

export function isTokenValid(token: string) {
  try {
    jwt.verify(token, CONFIG.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
