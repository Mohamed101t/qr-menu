import Fastify, {
  type FastifyInstance,
} from "fastify";
import { registerMenuRoutes } from "./features/menu/menu-route";
import { registerOrderRoutes } from "./features/orders/order-route";

interface BuildAppOptions {
  logger?: boolean;
}

export function buildApp(
  options: BuildAppOptions = {},
): FastifyInstance {
  const app = Fastify({
    logger: options.logger ?? false,
  });

  app.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: {
              status: {
                type: "string",
                const: "ok",
              },
            },
          },
        },
      },
    },
    async () => {
      return {
        status: "ok",
      };
    },
  );

  app.register(registerMenuRoutes);
  app.register(registerOrderRoutes);

  return app;
}
