import { ActionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import { commitSession, getSession } from "~/lib/session.server";
import { PrismaClient } from ".prisma/client";
import bcrypt from "bcryptjs";


export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
