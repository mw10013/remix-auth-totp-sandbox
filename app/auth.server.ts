import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";

/**
 * Creates authenticator with skeleton totps strategy.
 * 
 * Authenticator is non-functional and has just enough implementation
 * to compile and see if it loads in cloudflare wrangler.
 * 
 * Wrangler will report the following error:
 
 ✘ [ERROR] service core:user:worker: Uncaught TypeError: Object prototype may only be an Object or null: undefined

    at rozsq7n7fm9.js:71208:70 in Object.create.module2.exports
    at rozsq7n7fm9.js:71646:10 in node_modules/.pnpm/jws@3.2.2/node_modules/jws/lib/data-stream.js
    at rozsq7n7fm9.js:35:50
    at rozsq7n7fm9.js:71974:62 in node_modules/.pnpm/jws@3.2.2/node_modules/jws/lib/sign-stream.js
    at rozsq7n7fm9.js:35:50
    at rozsq7n7fm9.js:72096:22 in node_modules/.pnpm/jws@3.2.2/node_modules/jws/index.js
    at rozsq7n7fm9.js:35:50
    at rozsq7n7fm9.js:72126:15 in node_modules/.pnpm/jsonwebtoken@9.0.2/node_modules/jsonwebtoken/decode.js
    at rozsq7n7fm9.js:35:50

 * Note that if authenticator.use() is commented out, the error goes away.
 * @returns an Authenticator instance
 */
export function createAuthenticator() {
  const authSessionStorage = createCookieSessionStorage({
    cookie: {
      name: "_auth",
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secrets: ["SECRET"],
      secure: false,
    },
  });
  const authenticator = new Authenticator<{ email: string }>(
    authSessionStorage,
    {
      throwOnError: true,
    }
  );
  authenticator.use(
    new TOTPStrategy(
      {
        secret: "SECRET",
        magicLinkGeneration: { callbackPath: "/magic-link" },

        storeTOTP: async (data) => {
          console.log("storeTOTP:", data);
        },
        sendTOTP: async ({ email, code, magicLink }) => {
          console.log("sendTOTP:", { email, code, magicLink });
        },
        handleTOTP: async (hash, data) => {
          console.log("handleTOTP:", { hash, data });
          return {
            hash,
            attempts: 0,
            active: true,
            expiresAt: new Date(Date.now() + 60 * 1000),
          };
        },
      },
      async ({ email }) => {
        return {
          email,
        };
      }
    )
  );
  return {
    authenticator,
  };
}
