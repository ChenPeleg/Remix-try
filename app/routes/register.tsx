import { ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(name, email, password);
  return null

}

export default function Register() {
  return (<div className="auth-page">
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

          <Form method={'post'}>
            <fieldset className="form-group">
              <input className="form-control form-control-lg"
                     type="text"
                     placeholder="Your Name"
                     name={"name"}
              />
            </fieldset>
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
