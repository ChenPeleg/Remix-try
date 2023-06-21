import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "~/lib/db.server";

import { commitSession, getSession } from "~/lib/session.server";
import { handleExceptions } from "~/lib/http.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const CreateUserSchema = z.object({
    name: z
      .string()
      .min(1, { message: "can't be blank" })
      .min(2, { message: "can't be less than 2 chars" }),
    email: z.string().min(1, { message: "can't be blank" }).email(),
    password: z
      .string()
      .min(1, { message: "can't be blank" })
      .min(6, { message: "can't be less than 6 chars" })
      .max(20, { message: "can't be more than 20 chars" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/, {
        message:
          "must contain at least one lower case, one capital case, one number and one symbol",
      }),
  });

  const session = await getSession(request);

  try {
    const validated = await CreateUserSchema.parseAsync({
      name,
      email,
      password,
    });

    const user = await db.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: await bcrypt.hash(validated.password, 10),
      },
    });

    session.set("userId", user.id);

    session.flash(
      "success",
      "You are now successfully registered! Welcome to Conduit"
    );

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    session.flash("error", "Registration failed");
    session.flash("error", "Login failed");

    return handleExceptions(error);
  }
}

export default function Register() {
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <a href="">Have an account?</a>
            </p>

            <ul className="error-messages">
              <li>That email is already taken</li>
            </ul>

            <Form method={"post"}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  name={"name"}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  name={"email"}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  name={"password"}
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
