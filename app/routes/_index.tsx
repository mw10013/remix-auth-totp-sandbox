import { type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAuthenticator } from "~/auth.server";

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
  const authenticator = createAuthenticator();
  return {
    authenticator,
  };
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
function invariant(
  arg0: string | number | boolean | Date | undefined,
  arg1: string
) {
  throw new Error("Function not implemented.");
}
