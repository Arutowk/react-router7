import { Form, Link, NavLink, Outlet, useNavigation } from "react-router";
import { getContacts } from "../data";
import type { Route } from "./+types/sidebar";

//you can still use clientLoader (and clientAction) to do client-side data fetching where you see fit
//switch to using loader, which is used to fetch data on the server.
export async function loader({ request }: Route.LoaderArgs) {
  //loader functions have access to the search params from the request.
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts };
}

//React Router generates types for each route in your app to provide automatic type safety.
export default function SidebarLayout({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData;
  //useNavigation returns the current navigation state: it can be one of "idle", "loading" or "submitting".
  const navigation = useNavigation();

  return (
    <>
      <div id="sidebar">
        <h1>
          <Link to="about">React Router Contacts</Link>
        </h1>
        <div>
          {/* React Router emulates the browser by serializing the FormData into the URLSearchParams instead of the request body. */}
          <Form id="search-form" role="search">
            <input
              aria-label="Search contacts"
              id="q"
              name="q"
              placeholder="Search"
              type="search"
            />
            <div aria-hidden hidden={true} id="search-spinner" />
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      {/* Adds a nice fade after a short delay (to avoid flickering the UI for fast loads).  */}
      {/* You could do anything you want though, like show a spinner or loading bar across the top. */}
      <div
        className={navigation.state === "loading" ? "loading" : ""}
        id="detail"
      >
        <Outlet />
      </div>
    </>
  );
}
