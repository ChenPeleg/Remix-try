import { ActionArgs } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

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

          <form>
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
          </form>
        </div>
      </div>
    </div>
  </div>);
}
