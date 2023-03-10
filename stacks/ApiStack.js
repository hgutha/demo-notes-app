import { Api, use } from "@serverless-stack/resources";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack, app }) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    },
    cors: true,
    routes: {
        "GET /notes/{id}": "functions/get.main",
        "PUT /notes/{id}": "functions/update.main",
        "DELETE /notes/{id}": "functions/delete.main",
        "GET /notes": "functions/list.main",
        "POST /notes": "functions/create.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}