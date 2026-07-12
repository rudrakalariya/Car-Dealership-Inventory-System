# 🚗 Car Dealership Inventory System

A full-stack inventory management system for a car dealership, built using **Test-Driven Development (TDD)** methodology. The backend provides a RESTful API for managing vehicles, user authentication, inventory purchases, and restocking — all protected by role-based access control.

![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-4169E1?logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest-C21325?logo=jest&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [TDD Methodology](#-tdd-methodology)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#-api-documentation)
- [Running Tests](#-running-tests)
- [Project Structure](#-project-structure)
- [My AI Usage](#-my-ai-usage)

---

## 🔍 Project Overview

This application provides a complete inventory management solution for a car dealership. It enables:

- **User Authentication** — Register and login with JWT-based authentication.
- **Vehicle CRUD** — Create, read, update, and delete vehicle listings.
- **Advanced Search** — Filter vehicles by make, model, category, and price range with case-insensitive matching.
- **Inventory Management** — Customers can purchase vehicles (decreasing stock), and admins can restock vehicles (increasing stock).
- **Role-Based Access Control (RBAC)** — Routes are protected by role (`customer` or `admin`) ensuring only authorized users can perform sensitive operations like deleting vehicles or restocking inventory.

### 🎨 Frontend Features

The modern React-based Single Page Application (SPA) provides a premium, seamless user experience:

- **Beautiful UI/UX** — Designed with a dark, sleek aesthetic utilizing Tailwind CSS, Framer Motion for micro-animations, and Shadcn UI components.
- **Dynamic Catalogue** — Interactive vehicle browsing with real-time filtering, search, and dynamic image loading from Unsplash.
- **3D Hero Integration** — A stunning interactive 3D Porsche model integrated directly into the landing page for a premium dealership feel.
- **Admin Dashboard** — A dedicated, secure management interface for admins to add, edit, delete, and restock vehicles effortlessly.
- **Robust Client-Side Routing** — Powered by TanStack Router for type-safe, fast navigation.

---

## 📸 Screenshots

Here is a visual walkthrough of the DriveHub frontend experience:

|                Landing Page                |            Interactive Catalogue            |
| :----------------------------------------: | :-----------------------------------------: |
| ![Home Page](./screenshots/1-HomePage.png) | ![Catalogue](./screenshots/5-Catalogue.png) |

|                Sign In                 |                Sign Up                 |
| :------------------------------------: | :------------------------------------: |
| ![Sign In](./screenshots/2-SignIn.png) | ![Sign Up](./screenshots/3-SignUp.png) |

|                       Authenticated Home                       |                Admin Dashboard                |
| :------------------------------------------------------------: | :-------------------------------------------: |
| ![Home After Sign In](./screenshots/4-HomePageAfterSignIn.png) | ![Admin Dashboard](./screenshots/6-Admin.png) |

|             Add/Edit Vehicle Modal             |
| :--------------------------------------------: |
| ![Add Vehicle](./screenshots/7-AddVehicle.png) |

---

## 🛠 Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| **Runtime**    | Node.js                                         |
| **Language**   | TypeScript                                      |
| **Backend**    | Express.js 5                                    |
| **Database**   | PostgreSQL (NeonDB) — raw `pg` queries (no ORM) |
| **Auth**       | JSON Web Tokens (JWT) + bcrypt                  |
| **Validation** | Zod                                             |
| **Testing**    | Jest + Supertest                                |
| **Linting**    | ESLint + Prettier                               |
| **Git Hooks**  | Husky + lint-staged                             |
| **Frontend**   | React 19 + Vite 8                               |

---

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌────────────────┐     ┌──────────────┐
│   Client    │────▶│   Routes     │────▶│  Controllers   │────▶│   Models     │
│  (Postman / │     │  + Middleware │     │  + Validators  │     │  (Raw SQL)   │
│   React)    │◀─── │  (Auth/RBAC) │◀───|                │◀────│              │
└─────────────┘     └──────────────┘     └────────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
                                                                ┌──────────────┐
                                                                │  PostgreSQL  │
                                                                │   (NeonDB)   │
                                                                └──────────────┘
```

**Key Design Decisions:**

- **No ORM** — Raw parameterized SQL queries via `pg` for full control and learning purposes.
- **QueryBuilder Utility** — A custom chainable query builder for dynamic search queries, preventing SQL injection via parameterized indices (`$1`, `$2`, ...).
- **Generic Validation** — A reusable `validateData<T>()` utility wraps Zod schemas, centralizing error formatting across all endpoints.
- **Stock Validation Helper** — Business logic for stock checks is extracted into `validateStock()` to keep models clean.

---

## 🔴🟢🔵 TDD Methodology

This project was developed strictly following the **Red-Green-Refactor** cycle of Test-Driven Development. Every feature was built in three distinct phases:

```mermaid
graph TD
    A[🔴 RED<br/>Write a failing test] --> B[🟢 GREEN<br/>Write minimal code<br/>to make test pass]
    B --> C[🔵 REFACTOR<br/>Improve code while<br/>keeping tests green]
    C --> D{All tests pass?}
    D -->|Yes| E{Feature complete?}
    D -->|No| A
    E -->|No| F[Add next test case]
    E -->|Yes| G[✅ Feature Done]
    F --> A

    style A fill:#ffcccc,stroke:#ff0000,stroke-width:2px
    style B fill:#ccffcc,stroke:#00ff00,stroke-width:2px
    style C fill:#cce5ff,stroke:#0066cc,stroke-width:2px
    style G fill:#e6ffe6,stroke:#009900,stroke-width:3px
```

### 🔴 RED — Write Failing Tests First

Before writing any production code, failing test cases are written that define the expected behavior of the feature. These tests **must fail** initially, confirming that the feature does not yet exist.

**Example commit:**

```
test(auth): add user registration tests (RED)
- Test successful user registration with 201 status
- Test currently fail as auth routes not implemented
```

### 🟢 GREEN — Write Minimum Code to Pass

Only the minimum amount of production code necessary to make the failing tests pass is written. No extra features, no premature optimization — just enough code to turn the tests green.

**Example commit:**

```
feat(auth): implement user registration endpoint (GREEN)
- Create authController with register function
- Add authRoutes with POST /api/auth/register endpoint
- Registration test now pass
```

### 🔵 REFACTOR — Improve Code Quality

With passing tests as a safety net, the code is restructured for clarity, reusability, and maintainability — without changing its behavior. The tests must continue to pass after refactoring.

**Example commit:**

```
refactor(auth): extract validation logic into separate utility (REFACTOR)
- Move validation to utils/validators.ts
- Remove Zod validation from User model to improve separation of concerns
```

### TDD Cycle Applied Across the Project

| Feature           | RED (Tests)                       | GREEN (Implementation)            | REFACTOR                                |
| ----------------- | --------------------------------- | --------------------------------- | --------------------------------------- |
| User Registration | Auth registration tests           | Register endpoint + controller    | Extract validation utility              |
| User Login        | Login endpoint tests              | Login with JWT generation         | Extract JWT into tokenGenerator utility |
| Vehicle Creation  | Vehicle creation tests            | POST endpoint + auth middleware   | Extract auth middleware + role factory  |
| Vehicle Listing   | GET all vehicles tests            | GetAll model + controller         | —                                       |
| Vehicle Search    | Search filter tests               | Dynamic SQL search implementation | Extract to QueryBuilder utility         |
| Vehicle Update    | PUT partial update tests          | Update with VehicleUpdateSchema   | Extract validateData generic utility    |
| Vehicle Delete    | DELETE with RBAC tests            | Admin-only delete endpoint        | —                                       |
| Vehicle Purchase  | Purchase + stock validation tests | Purchase with stock checks        | Extract validateStock helper            |
| Vehicle Restock   | Admin restock tests               | Restock endpoint for admins       | —                                       |

> Every commit message is tagged with `(RED)`, `(GREEN)`, or `(REFACTOR)` to make the TDD cycle visible in the git history.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** database — You can use a cloud-hosted instance like [NeonDB](https://neon.tech/) or a local PostgreSQL installation.
- **Git** — [Download](https://git-scm.com/)

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/rudrakalariya/Car-Dealership-Inventory-System.git
   cd Car-Dealership-Inventory-System
   ```

2. **Install root dependencies** (for Husky, ESLint, Prettier)

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

4. **Configure environment variables**

   Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your actual credentials:

   ```env
   # Server configuration
   PORT=5000
   NODE_ENV=development

   # Database connection (use your NeonDB or local PostgreSQL URL)
   DATABASE_URL="postgresql://username:password@host:5432/database_name?sslmode=require"

   # JWT authentication
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="1d"
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will:
   - Automatically initialize the database schema (create `users` and `vehicles` tables if they don't exist).
   - Start listening on `http://localhost:5000`.

   You should see:

   ```
   Initializing database schema...
   ✅ Database schema initialized successfully (tables created on NeonDb)!
   Server is running on port 5000
   ```

6. **Verify** — Hit the health check endpoint:

   ```bash
   curl http://localhost:5000/health
   ```

   Expected response:

   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "timestamp": "2026-07-12T..."
   }
   ```

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The Vite development server will start at `http://localhost:5173`.

> **Note:** The frontend is currently scaffolded with React + Vite and contains the default starter template. The backend API is the primary focus of this project.

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint             | Auth Required | Description           |
| ------ | -------------------- | ------------- | --------------------- |
| POST   | `/api/auth/register` | ❌            | Register a new user   |
| POST   | `/api/auth/login`    | ❌            | Login and receive JWT |

#### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

Returns a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "username": "johndoe", "email": "john@example.com", "role": "customer" }
}
```

### Vehicle Endpoints

> All vehicle endpoints require the `Authorization: Bearer <token>` header.

| Method | Endpoint                     | Role Required | Description                       |
| ------ | ---------------------------- | ------------- | --------------------------------- |
| POST   | `/api/vehicles`              | `admin`       | Create a new vehicle              |
| GET    | `/api/vehicles`              | `customer`    | List all vehicles                 |
| GET    | `/api/vehicles/search`       | `customer`    | Search vehicles with filters      |
| PUT    | `/api/vehicles/:id`          | `admin`       | Update vehicle (full or partial)  |
| DELETE | `/api/vehicles/:id`          | `admin`       | Delete a vehicle                  |
| POST   | `/api/vehicles/:id/purchase` | `customer`    | Purchase vehicle (decrease stock) |
| POST   | `/api/vehicles/:id/restock`  | `admin`       | Restock vehicle (increase stock)  |

#### Create Vehicle

```bash
POST /api/vehicles
Authorization: Bearer <token>
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "category": "Sedan",
  "price": 25000,
  "quantity": 10
}
```

#### Search Vehicles

```bash
GET /api/vehicles/search?make=Toyota&minPrice=20000&maxPrice=40000
Authorization: Bearer <token>
```

Supported query parameters: `make`, `model`, `category`, `minPrice`, `maxPrice`

#### Purchase Vehicle

```bash
POST /api/vehicles/1/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1
}
```

#### Restock Vehicle (Admin Only)

```bash
POST /api/vehicles/1/restock
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "quantity": 5
}
```

---

## 🧪 Running Tests

The project uses **Jest** and **Supertest** for testing. All tests mock the database layer so they run without requiring a live database connection.

```bash
# Run from the backend directory
cd backend

# Run all tests
npm test

# Run tests in verbose mode
npx jest --verbose

# Run a specific test file
npx jest src/routes/__tests__/vehicle.routes.test.ts

# Run tests matching a pattern
npx jest -t "POST /api/auth/register"
```

### Test Coverage

The test suite includes **74 test cases across 6 test suites** covering:

| Module            | Test Cases                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Auth Register** | Successful registration, missing fields, invalid email, duplicate username/email, password length |
| **Auth Login**    | Successful login with JWT, missing fields, wrong credentials, non-existent user                   |
| **Vehicle CRUD**  | Create with auth, list all, search with filters, update (full/partial), delete                    |
| **RBAC**          | 401 for missing tokens, 403 for unauthorized roles, admin-only endpoints                          |
| **Inventory**     | Purchase with stock reduction, out-of-stock handling, insufficient stock, restock                 |

#### Coverage Proof

![Test Coverage](./screenshots/coverage.png)

---

## 📂 Project Structure

```
Car-Dealership-Inventory-System/
├── .husky/                          # Git hooks (pre-commit runs lint-staged)
├── .lintstagedrc                    # Lint-staged config (ESLint + Prettier on commit)
├── .prettierrc                      # Prettier formatting rules
├── eslint.config.mjs                # ESLint flat config (TypeScript rules)
├── package.json                     # Root workspace (Husky, ESLint, Prettier)
│
├── backend/
│   ├── .env.example                 # Environment variable template
│   ├── jest.config.js               # Jest configuration
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   └── src/
│       ├── app.ts                   # Express application entry point
│       ├── config/
│       │   ├── db.ts                # PostgreSQL connection pool + query helper
│       │   ├── init-db.ts           # Auto-initializes schema on startup
│       │   └── schema.sql           # DDL for users and vehicles tables
│       ├── controllers/
│       │   ├── auth.controller.ts   # Register & login handlers
│       │   └── vehicle.controller.ts # Vehicle CRUD + purchase/restock handlers
│       ├── middleware/
│       │   └── auth.middleware.ts    # JWT verification + role-based access control
│       ├── models/
│       │   ├── user.model.ts        # User DB operations (create, find, compare)
│       │   └── vehicle.model.ts     # Vehicle DB operations (CRUD, search, purchase, restock)
│       ├── routes/
│       │   ├── auth.routes.ts       # /api/auth/* route definitions
│       │   ├── vehicle.routes.ts    # /api/vehicles/* route definitions
│       │   └── __tests__/
│       │       ├── auth.routes.test.ts     # Auth endpoint test suite
│       │       └── vehicle.routes.test.ts  # Vehicle endpoint test suite
│       └── utils/
│           ├── queryBuilder.ts      # Chainable SQL query builder (prevents SQL injection)
│           ├── stockValidator.ts    # Stock availability business logic
│           ├── tokenGenerator.ts    # JWT sign & verify helpers
│           └── validators.ts        # Zod schemas + generic validateData<T> utility
```

---

## 🤖 My AI Usage

### Tools Used

- **Antigravity AI IDE**: Code completion, test generation, refactoring suggestions
- **Gemini**: Architecture decisions and debugging

### How I Used AI

| Use Case                         | Description                                                                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **TDD Test Generation**          | I described the feature requirements (e.g., "add failing tests for vehicle purchase"), and Gemini generated comprehensive test cases covering edge cases like out-of-stock, insufficient stock, and 404 scenarios. |
| **Implementation (GREEN Phase)** | After writing tests, I asked Gemini to implement the minimum code to pass them — controllers, models, and route wiring. It followed the existing patterns in the codebase. then manually checked the whole logic.  |
| **Refactoring**                  | I asked Gemini to extract reusable utilities (e.g., `QueryBuilder`, `validateData<T>`, `validateStock`) from inline code, improving code organization while keeping tests green.                                   |
| **API Endpoint Design**          | Gemini helped brainstorm RESTful endpoint structures and suggested appropriate HTTP status codes (204 for delete, 400 for stock errors, 403 for RBAC).                                                             |
| **Debugging**                    | When ESLint flagged unused variable assignments (e.g., `paramIndex` in the search query), Gemini identified the issue and refactored to the QueryBuilder pattern.                                                  |

### Reflection on AI's Impact

**Productivity:** AI significantly accelerated the development cycle, especially during the repetitive RED-GREEN phases. Writing boilerplate test mocks and CRUD implementations that follow established patterns became nearly instant.

**Code Quality:** By having an AI that understands the existing codebase context, refactoring suggestions were consistent with the project's established patterns (e.g., reusing the `validateData<T>` generic instead of duplicating Zod error handling).

**Learning:** Working with AI as a pair programmer was educational — it surfaced best practices like parameterized SQL queries, chainable builder patterns, and role-based middleware factories that I might have implemented less cleanly on my own.

**Limitations:** AI-generated code always needed review. For example, mock setups in tests sometimes didn't align with the actual number of database queries a method performed (e.g., restock uses a single atomic query, but the initial test mocked two queries). Human oversight was essential to catch these mismatches.

**Overall Verdict:** AI didn't replace the thinking — I still had to define _what_ to build, _how_ endpoints should behave, and _which_ edge cases mattered. AI handled the _how to write it_ part efficiently, letting me focus on architecture and design decisions.

> Every commit that includes AI-assisted code is tagged with:
> `Co-authored-by: Google Gemini <gemini@users.noreply.github.com>`

### My Approach

AI was a **productivity multiplier**, not a replacement. Every AI-generated code was:

1. Reviewed for correctness and security
2. Tested with TDD practices
3. Refactored to project standards
4. Fully understood before committing

---

## 📚 References

- **TDD Kata**: Incubyte's Car Dealership Inventory System
- **TDD Methodology**: [Roy Osherove's TDD Kata](http://osherove.com/tdd-kata-1/), [Clean Code Blog](https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html)
- **SOLID Principles**: [Uncle Bob's SOLID](https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html)

---

## 👨‍💻 Author

**Rudra Kalariya**

- GitHub: [@rudrakalariya](https://github.com/rudrakalariya)
- Repository: [Car-Dealership-Inventory-System](https://github.com/rudrakalariya/Car-Dealership-Inventory-System)

**Purpose**: Incubyte On-Campus Placement Drive Assessment

---

### Special Thanks:

- **Incubyte**: For providing this assessment opportunity
- **TDD Community**: For promoting best practices in software development

---

## 📞 Contact & Support

For questions or feedback about this project:

- Open an issue on [GitHub Issues](https://github.com/rudrakalariya/Car-Dealership-Inventory-System/issues)
- Email: rudrakalariya1@gmail.com

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
