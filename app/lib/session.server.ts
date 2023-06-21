import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
  userId: number
}

type SessionFlashData = {
  error: string
  success: string
}

export const { commitSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "real_world_remix_session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000 * 7,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET],
      secure: false
    }
  });

export function getSession(request: Request) {
  // Avoid having to reach into the request headers manually every time.
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

// re-export the commit and destroy methods.
export const destroySession = sessionStorage.destroySession;
