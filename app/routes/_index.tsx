import {
  createCookieSessionStorage,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Authenticator } from "remix-auth";
import { TOTPStrategy } from "remix-auth-totp";

interface User {
  id: string;
  email: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Auth Totp Sandbox" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {
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
  const authenticator = new Authenticator<User>(authSessionStorage, {
    throwOnError: true,
  });
  return {
    authenticator
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix Auth Totp Sandbox</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
