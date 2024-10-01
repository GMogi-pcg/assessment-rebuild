import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
openapi.get("/api/tasks/:taskSlug", TaskFetch);
openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// Handle file uploads to Cloudflare R2
app.post("/upload", async (c) => {
  const request = c.req;
  const env = c.env;

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");

      if (file) {
        const fileName = file.name;
        const fileData = await file.arrayBuffer();

        await env.MY_BUCKET.put(fileName, fileData);

        return c.text("File uploaded successfully", 200);
      } else {
        return c.text("No file found in request", 400);
      }
    }

    return c.text("Invalid content type", 400);
  }

  return c.text("Method not allowed", 405);
});

// Handle file downloads from Cloudflare R2
app.get("/download/:fileName", async (c) => {
  const fileName = c.req.param("fileName");
  const fileObject = await c.env.MY_BUCKET.get(fileName);

  if (fileObject) {
    return new Response(fileObject.body, {
      headers: { "Content-Type": "application/octet-stream" },
    });
  }

  return c.text("File not found", 404);
});

// Export the Hono app and Cloudflare Worker handler
export default {
  fetch: app.fetch,
};
