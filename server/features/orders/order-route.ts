import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import { findMenuByRestaurantSlug } from "../menu/menu-data";
import type {
  CreateOrderRequest,
  CreatedOrder,
  OrderItemSnapshot,
} from "./order";

interface CreateOrderHeaders {
  "idempotency-key": string;
}

interface StoredAttempt {
  fingerprint: string;
  order: CreatedOrder;
}

export async function registerOrderRoutes(
  app: FastifyInstance,
): Promise<void> {
  const attempts = new Map<string, StoredAttempt>();

  app.post<{
    Body: CreateOrderRequest;
    Headers: CreateOrderHeaders;
  }>(
    "/api/v1/orders",
    {
      schema: {
        headers: {
          type: "object",
          required: ["idempotency-key"],
          properties: {
            "idempotency-key": {
              type: "string",
              minLength: 8,
              maxLength: 128,
            },
          },
        },
        body: {
          type: "object",
          additionalProperties: false,
          required: ["restaurantSlug", "items"],
          properties: {
            restaurantSlug: {
              type: "string",
              minLength: 1,
              maxLength: 100,
              pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
            },
            items: {
              type: "array",
              minItems: 1,
              maxItems: 50,
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "productId",
                  "quantity",
                  "observedUnitPrice",
                ],
                properties: {
                  productId: {
                    type: "string",
                    minLength: 1,
                    maxLength: 100,
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    maximum: 100,
                  },
                  observedUnitPrice: {
                    type: "number",
                    minimum: 0,
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const idempotencyKey =
        request.headers["idempotency-key"];
      const fingerprint = JSON.stringify(request.body);
      const previousAttempt = attempts.get(idempotencyKey);

      if (previousAttempt) {
        if (previousAttempt.fingerprint !== fingerprint) {
          return reply.code(409).send({
            code: "IDEMPOTENCY_KEY_REUSED",
            message:
              "Idempotency key was already used for another request.",
          });
        }

        return reply.code(200).send({
          order: previousAttempt.order,
        });
      }

      const menu = findMenuByRestaurantSlug(
        request.body.restaurantSlug,
      );

      if (!menu) {
        return reply.code(404).send({
          code: "MENU_NOT_FOUND",
          message: "Restaurant menu not found.",
        });
      }

      const seenProductIds = new Set<string>();
      const orderItems: OrderItemSnapshot[] = [];
      const priceChanges: Array<{
        productId: string;
        observedUnitPrice: number;
        currentUnitPrice: number;
      }> = [];
      const unavailableProductIds: string[] = [];

      for (const item of request.body.items) {
        if (seenProductIds.has(item.productId)) {
          return reply.code(400).send({
            code: "DUPLICATE_PRODUCT",
            message:
              "The same product cannot appear more than once.",
          });
        }

        seenProductIds.add(item.productId);
        const product = menu.products.find(
          (candidate) => candidate.id === item.productId,
        );

        if (!product) {
          return reply.code(400).send({
            code: "PRODUCT_NOT_FOUND",
            message: "Product not found.",
            productId: item.productId,
          });
        }

        if (!product.isAvailable) {
          unavailableProductIds.push(product.id);
          continue;
        }

        if (item.observedUnitPrice !== product.price) {
          priceChanges.push({
            productId: product.id,
            observedUnitPrice: item.observedUnitPrice,
            currentUnitPrice: product.price,
          });
          continue;
        }

        orderItems.push({
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        });
      }

      if (unavailableProductIds.length > 0) {
        return reply.code(409).send({
          code: "PRODUCT_UNAVAILABLE",
          message: "One or more products are unavailable.",
          productIds: unavailableProductIds,
        });
      }

      if (priceChanges.length > 0) {
        return reply.code(409).send({
          code: "PRICE_CHANGED",
          message: "One or more product prices changed.",
          changes: priceChanges,
        });
      }

      const total = orderItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0,
      );
      const orderId = randomUUID();
      const order: CreatedOrder = {
        id: orderId,
        orderNumber: `ORD-${orderId.replaceAll("-", "").slice(0, 8).toUpperCase()}`,
        restaurantId: menu.restaurant.id,
        status: "NEW",
        items: orderItems,
        total,
        createdAt: new Date().toISOString(),
      };

      attempts.set(idempotencyKey, { fingerprint, order });
      return reply.code(201).send({ order });
    },
  );
}
