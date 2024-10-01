import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { Task } from "../types";

export class TaskCreate extends OpenAPIRoute {
  constructor() {
    super();
    // Move schema definition inside the constructor
    this.schema = {
      tags: ["Tasks"],
      summary: "Create a new Task",
      request: {
        body: {
          content: {
            "application/json": {
              schema: Task,
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Returns the created task",
          content: {
            "application/json": {
              schema: z.object({
                series: z.object({
                  success: Bool(),
                  result: z.object({
                    task: Task,
                  }),
                }),
              }),
            },
          },
        },
      },
    };
  }

  async handle(c) {
    // Get validated data (no need for type annotations in JS)
    const data = await this.getValidatedData();

    // Retrieve the validated request body
    const taskToCreate = data.body;

    // Implement your own object insertion logic here

    // Return the new task
    return {
      success: true,
      task: {
        name: taskToCreate.name,
        slug: taskToCreate.slug,
        description: taskToCreate.description,
        completed: taskToCreate.completed,
        due_date: taskToCreate.due_date,
      },
    };
  }
}
