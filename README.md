# tabienselect

Fullstack license plate marketplace.

- **Frontend:** Next.js 14 (App Router) + TailwindCSS
- **Backend:** Node.js + Express + Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (admin only)

## Project Structure

```
tabienselect/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/           # env, prisma client
│   │   ├── controllers/      # request handlers
│   │   ├── middlewares/      # auth, error handler
│   │   ├── routes/           # express routers
│   │   ├── services/         # business logic
│   │   ├── validators/       # zod schemas
│   │   ├── utils/            # helpers (jwt, password)
│   │   ├── app.js            # express app factory
│   │   └── server.js         # entrypoint
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx              # listing
    │   │   ├── plates/[id]/page.tsx  # detail
    │   │   └── admin/login/page.tsx  # admin login
    │   ├── components/
    │   └── lib/
    ├── .env.example
    └── package.json
```

## Setup

### 1. PostgreSQL

Create a database, e.g. `tabienselect`.

docker exec -it tabienselect-postgres-1 psql -U postgres -d tabienselect

### 2. Backend

```bash
cd backend
cp .env.example .env        # edit DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD
npm install
npx prisma migrate dev --name init
npm run seed                 # optional: create admin + sample plates
npm run dev                  # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev                  # http://localhost:3000
```

## API

| Method | Path                  | Auth  | Description          |
|--------|-----------------------|-------|----------------------|
| GET    | /api/plates           | -     | List plates          |
| GET    | /api/plates/:id       | -     | Get plate            |
| POST   | /api/plates           | admin | Create plate         |
| PUT    | /api/plates/:id       | admin | Update plate         |
| DELETE | /api/plates/:id       | admin | Delete plate         |
| POST   | /api/auth/login       | -     | Admin login → JWT    |

Auth header: `Authorization: Bearer <token>`
