# ADR-003: Backend Technology Stack

## Status

Accepted

## Context

The project needs a backend that can securely validate menu data,
prices, availability, and order creation.

The backend should remain simple enough for an MVP while being suitable
for a commercial product that can grow later.

## Decision

The initial backend stack will use:

- Node.js
- TypeScript
- Fastify
- PostgreSQL
- node-postgres (pg)
- Vitest

No ORM will be introduced in the initial backend.

## API Framework

Fastify is selected because it provides:

- clear route structure,
- request and response schema validation,
- good TypeScript support,
- plugin-based architecture,
- built-in support for production API patterns,
- low framework overhead.

Express was considered but would require more manual setup for validation
and structure.

NestJS was considered but introduces more architectural complexity than
the current MVP requires.

Hono was considered but does not provide enough benefit for this
traditional Node.js and PostgreSQL backend to justify changing direction.

## Database

PostgreSQL is selected as the system of record.

It is suitable for:

- restaurants,
- categories,
- products,
- orders,
- order items,
- idempotency records,
- analytics events,
- future reporting.

## Database Access

The initial version will use node-postgres (`pg`) directly.

Reasons:

- stable and widely used,
- explicit SQL,
- connection pooling,
- parameterized queries,
- minimal abstraction,
- no ORM lifecycle dependency.

Queries must always use parameters for untrusted values.

Example concept:

SELECT * FROM products WHERE id = $1

Never:

SELECT * FROM products WHERE id = '${userInput}'

## ORM Policy

An ORM is intentionally deferred.

We will reconsider an ORM only if:

- query duplication becomes significant,
- schema maintenance becomes difficult,
- type-safe database access provides measurable value,
- the project grows beyond the simplicity of direct SQL.

We will not add an ORM only because it is popular.

## Database Migrations

Database schema changes will be version-controlled.

The first implementation may use explicit SQL migration files.

Every migration must be:

- reviewable,
- repeatable,
- ordered,
- committed to Git.

Production schema changes must never depend on manually editing tables.

## Validation

Fastify route schemas will validate external API input.

Database constraints will provide another validation layer.

Business rules remain in application/domain logic.

## Testing

Vitest remains the test runner.

Backend testing will include:

- unit tests for business logic,
- API integration tests,
- database integration tests when PostgreSQL is introduced.

## Runtime

Development currently uses Node.js 26 LTS.

Before production deployment, runtime compatibility of all backend
dependencies must be verified and the production Node.js version pinned.

## Non-Goals

This decision does not add:

- Redis,
- message queues,
- microservices,
- GraphQL,
- Kubernetes,
- an ORM,
- serverless architecture.

These will only be introduced if a demonstrated requirement appears.

## Consequences

The backend begins with a small dependency surface and explicit control
over SQL and business rules.

The architecture can later adopt additional infrastructure without
requiring it during the MVP phase.

## Revisit Trigger

Review this decision if:

- database access becomes difficult to maintain,
- multiple backend services appear,
- transaction complexity increases significantly,
- production scaling reveals a concrete limitation.
