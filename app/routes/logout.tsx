import { ActionArgs, json, redirect } from "@remix-run/node";

import { commitSession, getSession } from "~/lib/session.server";

export async function action({ request }: ActionArgs) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
