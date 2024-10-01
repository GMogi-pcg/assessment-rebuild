import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";

export class TaskDelete extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Delete a Task by slug",
    request: {
      params: z.object({
        taskSlug: Str({ description: "Task slug" }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a success message if the task was deleted",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                result: z.object({
                  message: Str(),
                }),
              }),
            }),
          },
        },
      },
      "404": {
        description: "Task not found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: Str(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData();

    // Retrieve the validated slug
    const { taskSlug } = data.params;

    // Implement your own object deletion here
    const exists = true; // Simulate task existence check

    if (!exists) {
      return Response.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    // Simulate deletion success
    return {
      success: true,
      message: `Task with slug '${taskSlug}' was deleted successfully.`,
    };
  }
}
