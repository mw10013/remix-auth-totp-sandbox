import * as jwt from "jsonwebtoken";

export function createToken() {
  const token = jwt.sign("payload", "SECRET", { expiresIn: "1h" });
  return token;
}
