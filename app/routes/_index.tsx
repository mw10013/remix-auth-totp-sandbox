import { type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createToken } from "~/util.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Auth Totp Sandbox" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

//     process.env.NODE_DEBUG && (debugEnv = process.env.NODE_DEBUG, debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), debugEnvRegex = new RegExp("^" + debugEnv + "$", "i"));

export function loader() {
  const token = createToken();
  return { env: process.env, token };
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
