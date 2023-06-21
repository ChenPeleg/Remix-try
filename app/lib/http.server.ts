import type { Session } from "@remix-run/node";
import { badRequest, unprocessableEntity } from "remix-utils";
import { z } from "zod";
import type { SessionData, SessionFlashData } from "./session.server";
import { commitSession } from "./session.server";

export async function handleExceptions(
  error: unknown,
  session?: Session<SessionData, SessionFlashData>
) {
  // Having to pass in the session and set the `Set-Cookie` header is temporary until we will migrate to a different session driver in the next lesson

  if (error instanceof z.ZodError) {
    return unprocessableEntity(
      { errors: error.flatten().fieldErrors },
      {
        headers: session
          ? {
              "Set-Cookie": await commitSession(session),
            }
          : {},
      }
    );
  }

  return badRequest(
    { errors: {} },
    {
      headers: session
        ? {
            "Set-Cookie": await commitSession(session),
          }
        : {},
    }
  );
}
