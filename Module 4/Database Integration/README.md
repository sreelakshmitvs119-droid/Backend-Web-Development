# Database Integration with Prisma and PostgreSQL

This project replaces the in-memory post repository with a Prisma-backed PostgreSQL implementation while keeping the existing service and controller contracts unchanged.

## Project architecture

- Controller calls service
- Service calls repository
- Repository uses Prisma Client
- Prisma connects to PostgreSQL

## Local setup

1. Install dependencies

```bash
npm install
```

2. Create a local `.env` file from the example

```bash
copy .env.example .env
```

Then set a valid local PostgreSQL URL, for example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/community_dev?schema=public"
PORT=3000
```

3. Validate and format the Prisma schema

```bash
npm run prisma:format
npm run prisma:validate
```

4. Create and apply the migration

```bash
npx prisma migrate dev --name initial_database
```

5. Generate the Prisma client and seed the database

```bash
npm run prisma:generate
npm run prisma:seed
```

6. Start the API

```bash
npm start
```

## API behavior

The app keeps the original HTTP contract:

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PATCH /posts/:id`
- `DELETE /posts/:id`

Validation and not-found behavior remain the same:

- Title is required for POST creation
- Missing post returns `404`
- Invalid foreign key on `authorId` returns a safe application error

## Important notes

- Never commit `.env`
- Keep the repository schema and migration in sync
- Do not import Prisma into service or controller layers
- Repository is the only layer that knows about Prisma/PostgreSQL

## Useful commands

```bash
npm run prisma:format
npm run prisma:validate
npx prisma migrate dev --name initial_database
npm run prisma:generate
npm run prisma:seed
npm start
```
