# Arcana — The Major Arcana Archive

> A full-stack esoteric archive and interactive Tarot contemplation application featuring the 22 Major Arcana archetypes, built with a modern React frontend and a NestJS backend following clean MVC architecture.

---

## 🌟 Overview

**Arcana** is an interactive Tarot Card archive designed for reflection, personal growth, and study of the archetypal journey. This release integrates a **NestJS REST API backend** using the **Model-View-Controller (MVC)** architectural pattern with the existing **React** single-page application.

- **Frontend:** Interactive exploration deck, reading room with card flip animations, theme exploration, daily draw, and an administrative **Deck Manager** supporting complete CRUD operations.
- **Backend:** Modular NestJS API with dependency injection, DTOs with `class-validator`, in-memory storage, strict input validation, and semantic error handling (`NotFoundException`, `ConflictException`, `BadRequestException`).
- **REST Client Testing:** Ready-to-run `.rest` test suite compatible with the VS Code REST Client extension.

---

## 🛠️ Technology Stack

### Backend
- **Framework:** NestJS v10 (Node.js framework for scalable server-side applications)
- **Language:** TypeScript 5
- **Architecture:** MVC (Model-View-Controller) pattern with modular separation
- **Validation:** `class-validator` & `class-transformer`
- **Data Transfer Objects:** NestJS `@nestjs/mapped-types` (`PartialType`)
- **Storage:** Thread-safe In-Memory array storage initialized with all 22 Major Arcana archetypes
- **API Style:** RESTful HTTP API with global `/api` prefix and CORS enabled

### Frontend
- **Framework:** React 18 + Vite 6
- **Routing:** React Router DOM v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Design System:** Bespoke dark/light parchment themes with Cormorant Garamond serif typography
- **State & API Service:** Custom `TarotContext` + `tarotApi` service with resilient fallback

---

## 📁 Project Directory Structure

```
Arcana-Project/
├── backend/                             # NestJS Backend Application
│   ├── src/
│   │   ├── main.ts                      # NestJS entry point (CORS, global prefix, validation pipe)
│   │   ├── app.module.ts                # Root application module
│   │   └── tarot-cards/                 # Tarot Cards Resource Module
│   │       ├── tarot-cards.module.ts    # Module definition (registers controller & service)
│   │       ├── tarot-cards.controller.ts# Controller (HTTP endpoints & route routing)
│   │       ├── tarot-cards.service.ts   # Service (business logic & in-memory store)
│   │       ├── entities/
│   │       │   └── tarot-card.entity.ts # Model / Entity definition
│   │       └── dto/
│   │           ├── create-tarot-card.dto.ts # DTO with class-validator decorators
│   │           └── update-tarot-card.dto.ts # DTO extending PartialType
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   └── tarot-cards.rest                # Copy of REST Client requests
├── docs/
│   └── screenshots/                     # Directory for assignment screenshots & media
├── src/                                 # React Frontend Application
│   ├── components/                      # UI Components (Header, Sidebar, TarotCard, etc.)
│   ├── context/
│   │   └── TarotContext.jsx             # React Context for live backend synchronization
│   ├── data/                            # Static deck data, categories, spreads, nav
│   ├── hooks/                           # Custom React hooks (useLocalStorage)
│   ├── pages/                           # Application Pages
│   │   ├── Home.jsx                     # Hero, Card of the Day, themes, deck strip
│   │   ├── AllCards.jsx                 # Filterable 22 Major Arcana grid
│   │   ├── CardDetail.jsx               # Deep dive card inspection & correspondences
│   │   ├── ManageCards.jsx              # Admin Deck Manager (Add, Edit, Delete CRUD UI)
│   │   ├── Reading.jsx                  # Interactive Tarot reading room
│   │   ├── Category.jsx                 # Theme-based exploration
│   │   ├── About.jsx                    # History & explanation articles
│   │   └── NotFound.jsx                 # 404 fallback page
│   ├── services/
│   │   └── tarotApi.js                  # Reusable HTTP client service for backend communication
│   ├── styles/                          # CSS stylesheets (base, layout, components, pages, manage)
│   ├── App.jsx                          # Main route configuration
│   └── main.jsx                         # React entry point with TarotProvider
├── tarot-cards.rest                     # VS Code REST Client test suite
├── test-e2e.js                          # Automated E2E test suite for NestJS backend
├── package.json                         # Frontend dependencies & scripts
├── vite.config.js                       # Vite build configuration
└── README.md                            # Documentation
```

---

## 🏛️ MVC Architecture Explanation

The backend follows the clean **Model-View-Controller (MVC)** architectural pattern:

```
                  HTTP Requests (GET, POST, PATCH, DELETE)
                                  │
                                  ▼
                        ┌───────────────────┐
                        │    Controller     │  (TarotCardsController)
                        │  Route Handlers   │
                        └─────────┬─────────┘
                                  │ Dependency Injection
                                  ▼
                        ┌───────────────────┐
                        │     Service       │  (TarotCardsService)
                        │  Business Logic   │
                        └─────────┬─────────┘
                                  │ Manipulates & Validates
                                  ▼
            ┌───────────────────────────────────────────────┐
            │                     Model                     │
            │  Entity: TarotCard                            │
            │  DTOs: CreateTarotCardDto, UpdateTarotCardDto │
            │  Storage: In-Memory Array (22 Initial Cards)  │
            └───────────────────────────────────────────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │     View (API)    │  JSON Responses / React Frontend
                        └───────────────────┘
```

1. **Model (`entities/tarot-card.entity.ts`, `dto/`):**
   - Represents the domain data structure and rules.
   - `TarotCard` entity defines all properties: `id`, `name`, `number`, `arcana`, `uprightMeaning`, `reversedMeaning`, `description`, `symbolism`, `element`, `planet`, `zodiac`, `image`, `keywords`, `isFavorite`, `createdAt`, `updatedAt`, and frontend compatibility fields.
   - `CreateTarotCardDto` and `UpdateTarotCardDto` define request validation schemas using decorators (`@IsString()`, `@IsNotEmpty()`, `@MinLength()`, `@IsNumber()`, `@Min()`, `@IsBoolean()`, `@IsArray()`, `@IsOptional()`).

2. **Controller (`tarot-cards.controller.ts`):**
   - Handles incoming HTTP requests, maps routes, and parses route parameters (`@Param('id', ParseIntPipe)`).
   - Injects `TarotCardsService` via dependency injection without manually creating instances.
   - Delegates all business logic to the service and returns JSON responses.

3. **Service (`tarot-cards.service.ts`):**
   - Contains all CRUD operations (`findAll`, `findOne`, `create`, `update`, `remove`).
   - Manages the in-memory array initialized with the complete original 22 Major Arcana cards.
   - Enforces unique IDs, prevents duplicate names/numbers, and throws standard NestJS exceptions (`NotFoundException`, `ConflictException`).

4. **View:**
   - In this decoupled architecture, the View layer is represented by the REST API JSON output and consumed directly by the React frontend components.

---

## 🚀 Installation & Setup Instructions

Ensure you have **Node.js (v18+)** and **npm** installed.

### 1. Install Dependencies

Open two separate terminals:

#### Terminal 1 — Frontend:
```bash
# In the project root directory:
npm install
```

#### Terminal 2 — Backend:
```bash
# Navigate to the backend directory:
cd backend
npm install
```

---

## 💻 Running the Application

### 1. Start the Backend Server (Terminal 1)

```bash
cd backend
npm run start:dev
```
The NestJS server will start on: **`http://localhost:3000/api`**

### 2. Start the Frontend Development Server (Terminal 2)

```bash
npm run dev
```
The Vite development server will start on: **`http://localhost:5173`**

Open `http://localhost:5173` in your browser. The application will automatically connect to `http://localhost:3000/api` and sync live card data!

---

## 📡 REST API Endpoint Documentation

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description | Request Body | Success Response | Error Codes |
|---|---|---|---|---|---|
| **GET** | `/api/tarot-cards` | Retrieve all tarot cards | None | `200 OK` (Array of cards) | `500` |
| **GET** | `/api/tarot-cards/:id` | Retrieve a single card by ID | None | `200 OK` (Card object) | `404 Not Found` |
| **POST** | `/api/tarot-cards` | Create a new card | `CreateTarotCardDto` | `201 Created` (Created card) | `400 Bad Request`, `409 Conflict` |
| **PATCH** | `/api/tarot-cards/:id` | Update an existing card | `UpdateTarotCardDto` | `200 OK` (Updated card) | `404 Not Found`, `409 Conflict`, `400 Bad Request` |
| **DELETE** | `/api/tarot-cards/:id` | Delete a card by ID | None | `200 OK` (`{ message, card }`) | `404 Not Found` |

### Error Scenarios Handled:
- **`404 Not Found`:** Returned when requesting, updating, or deleting a card ID that does not exist.
  ```json
  {
    "message": "Tarot card with ID 999 not found.",
    "error": "Not Found",
    "statusCode": 404
  }
  ```
- **`409 Conflict`:** Returned when creating or updating a card with a duplicate `name` or `number`.
  ```json
  {
    "message": "Tarot card with name \"The Fool\" already exists.",
    "error": "Conflict",
    "statusCode": 409
  }
  ```
- **`400 Bad Request`:** Returned when DTO validation fails (e.g., negative number, missing required fields, string too short).
  ```json
  {
    "message": [
      "name must be longer than or equal to 2 characters",
      "number must not be less than 0"
    ],
    "error": "Bad Request",
    "statusCode": 400
  }
  ```

---

## 🧪 REST Client Testing Instructions

A comprehensive test suite is provided in [`tarot-cards.rest`](file:///tarot-cards.rest) (also mirrored in `backend/tarot-cards.rest`).

### How to use with VS Code REST Client:
1. Install the **REST Client** extension by Huachao Mao (`humao.rest-client`) in VS Code.
2. Open [`tarot-cards.rest`](file:///tarot-cards.rest).
3. Ensure the backend is running (`cd backend && npm run start:dev`).
4. Click **"Send Request"** above any request in the file to test:
   - `GET {{baseUrl}}/tarot-cards` — Get all 22 cards
   - `GET {{baseUrl}}/tarot-cards/0` — Get The Fool
   - `POST {{baseUrl}}/tarot-cards` — Create new card ("The Cosmos" #22)
   - `PATCH {{baseUrl}}/tarot-cards/22` — Update card properties
   - `DELETE {{baseUrl}}/tarot-cards/22` — Delete card
   - `GET {{baseUrl}}/tarot-cards/999` — Test 404 (Not Found)
   - `POST {{baseUrl}}/tarot-cards` (duplicate) — Test 409 (Conflict)
   - `POST {{baseUrl}}/tarot-cards` (invalid) — Test 400 (Bad Request)

### Automated Test Suite:
You can also run the automated end-to-end test suite at any time:
```bash
node test-e2e.js
```
This script launches the NestJS server, executes all 9 API test cases sequentially, verifies status codes and response bodies, and terminates cleanly.

---

## 🎴 Frontend CRUD Interface (Deck Manager)

Access the **Deck Manager** from the navigation sidebar or by visiting `http://localhost:5173/manage`:
- **Read:** Live card listing with thumbnail previews, numbers, astrological & elemental correspondences, and search filtering.
- **Create:** Click **"+ Add New Card"** to open a modal form with field validation.
- **Update:** Click the **Edit** icon on any card to update its meaning, quote, keywords, or correspondences.
- **Delete:** Click the **Trash** icon to trigger an inline confirmation dialog and remove the card.
- **Connection Status:** A live indicator displays whether the backend REST API is connected or operating in resilient fallback mode.

---

## 📸 Screenshots

Screenshots for assignment submission can be stored in the [`docs/screenshots/`](file:///docs/screenshots/) directory.
#   A r c a n a - P r o j e c t - P P W  
 