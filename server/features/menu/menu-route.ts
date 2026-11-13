import type { FastifyInstance } from "fastify";
import { findMenuByRestaurantSlug } from "./menu-data";

interface MenuParams {
  restaurantSlug: string;
}

export async function registerMenuRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get<{ Params: MenuParams }>(
    "/api/v1/menu/:restaurantSlug",
    {
      schema: {
        params: {
          type: "object",
          additionalProperties: false,
          required: ["restaurantSlug"],
          properties: {
            restaurantSlug: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              pattern:
                "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            },
          },
        },
      },
    },
    async (request, reply) => {
      const menu = findMenuByRestaurantSlug(
        request.params.restaurantSlug,
      );

      if (!menu) {
        return reply.code(404).send({
          code: "MENU_NOT_FOUND",
          message: "Restaurant menu not found.",
        });
      }

      return reply.code(200).send(menu);
    },
  );
}
