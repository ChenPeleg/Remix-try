import { Form } from "@remix-run/react";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import z from "zod";
import { handleExceptions } from "~/lib/http.server";
import { db } from "~/lib/db.server";
import { jsonHash } from "remix-utils";

export async function loader({ request }: LoaderArgs) {
  return jsonHash({
    async articles() {
      return db.article.findMany({
        include: {
          author: {
            select: {
              avatar: true,
              name: true,
            },
          },
        },
      });
    },
  });
}
export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const body = formData.get("body");
  const ArticleSchema = z.object({
    title: z.string().min(1, { message: "can't be blank" }),
    description: z.string().min(1, { message: "can't be blank" }),
    body: z.string().min(1, { message: "can't be blank" }),
  });

  try {
    const validated = await ArticleSchema.parseAsync({
      title,
      description,
      body,
    });
    const article = await db.article.create({
      data: {
        body: validated.body,
        description: validated.description,
        title: validated.title,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return redirect("/");
  } catch (error) {
    return handleExceptions(error);
  }

  // validate the form data
  // write the data to the db
  // send an http response back
}

export default function ArticlesNew() {
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <Form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    name={"title"}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    name={"description"}
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    name={"description"}
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                  />
                  <div className="tag-list"></div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                >
                  Publish Article
                </button>
              </fieldset>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
