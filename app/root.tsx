import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta, NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
{  href:"//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css",
  rel:"stylesheet",
  type:"text/css"},
  {    href:"//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic",
  rel:"stylesheet",
  type:"text/css"},
  {rel:"stylesheet" ,href:"//demo.productionready.io/main.css"},
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <nav className="navbar navbar-light">


      <div className="container">
        <a className="navbar-brand" href="index.html">conduit</a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">

            <a className="nav-link active" href="">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href=""> <i className="ion-compose"></i>&nbsp;New Article </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href=""> <i className="ion-gear-a"></i>&nbsp;Settings </a>
          </li>
          <li className="nav-item">

            <NavLink className={({isActive})=> isActive ? 'active': 'not-active'} to={"/register"}>
              Sign in
            </NavLink>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="">Sign up</a>
          </li>
        </ul>
      </div>
      </nav>

        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />

    <footer>
  <div className="container">
    <a href="/" className="logo-font">conduit</a>
    <span className="attribution">
      An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp;
      design licensed under MIT.
    </span>
  </div>
</footer>
      </body>
    </html>
  );
}
