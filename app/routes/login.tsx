import { Form } from "@remix-run/react";
import { ActionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import { PrismaClient } from ".prisma/client";
import bcrypt from "bcryptjs";

import { commitSession, getSession } from '~/lib/session.server'

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()

  const email = formData.get('email')
  const password = formData.get('password')

  const LoginUserSchema = z.object({
    email: z.string().min(1, { message: "can't be blank" }).email(),
    password: z.string().min(1, { message: "can't be blank" }),
  })

  const session = await getSession(request)

  try {
    const validated = await LoginUserSchema.parseAsync({ email, password })

    const db = new PrismaClient()

    const user = await db.user.findFirst({ where: { email: validated.email } })

    if (!user) {
      return json(
        {
          errors: {
            'email or password': ['is invalid'],
          },
        },
        { status: 422 }
      )
    }

    const match = await bcrypt.compare(validated.password, user.password)

    if (!match) {
      return json(
        {
          errors: {
            'email or password': ['is invalid'],
          },
        },
        { status: 422 }
      )
    }

    session.set('userId', user.id)

    session.flash('success', `Welcome back ${user.name}!`)

    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.flatten().fieldErrors }, { status: 422 })
    }

    session.flash('error', 'Login failed')

    return json(
      { errors: {} },
      {
        status: 400,
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      }
    )
  }
}

export default function Login() {
  return (<div className="auth-page">
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Log In</h1>
          <p className="text-xs-center">
            <a href="">Have an account?</a>
          </p>

          <ul className="error-messages">
            <li>That email is already taken</li>
          </ul>

          <Form method={"post"}>

            <fieldset className="form-group">
              <input className="form-control form-control-lg" type="text" placeholder="Email"
                     name={"email"} />
            </fieldset>
            <fieldset className="form-group">
              <input
                className="form-control form-control-lg" type="password"
                placeholder="Password"
                name={"password"}
              />
            </fieldset>
            <button className="btn btn-lg btn-primary pull-xs-right">Sign up</button>
          </Form>
        </div>
      </div>
    </div>
  </div>);
}
