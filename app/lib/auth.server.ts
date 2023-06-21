import { getSession } from "~/lib/session.server";
import { redirect } from "@remix-run/node";

export async function requireLogin(request: Request) {
  const session = await getSession(request);

  const userId = session.get("userId");

  const url = new URL(request.url);

  const searchParams = new URLSearchParams({ next: url.pathname });

  if (!userId) {
    // set the current url as a search param in the redirect URL
    throw redirect(`/login?${searchParams.toString()}`);
  }

  return userId;
}
