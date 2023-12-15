import { createCookieSessionStorage } from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp-dev";

/**
 * Creates authenticator with skeleton totps strategy.
 * 
 * Authenticator is non-functional and has just enough implementation
 * to compile and see if it loads in cloudflare wrangler.
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
