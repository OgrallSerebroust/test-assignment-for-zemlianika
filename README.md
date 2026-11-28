<h3 align="center">
    Test assignment for Zemlianika
</h3>
<div align="center">
    Appeals service created as part of a test assignment for the Zemlianika web-design company.
</div>

---

<div align="center">
    <img src="https://img.shields.io/badge/license-PolyForm Noncommercial-orange?labelColor=555555&color=007EC6" alt="License">
    <img alt="Dynamic TOML Badge" src="https://img.shields.io/badge/dynamic/toml?url=https://raw.githubusercontent.com/OgrallSerebroust/test-assignment-for-zemlianika/refs/heads/master/backend/pyproject.toml&query=$.[project][version]&label=version&labelColor=555555&color=007EC6">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors/OgrallSerebroust/test-assignment-for-zemlianika?labelColor=555555&color=007EC6">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/OgrallSerebroust/test-assignment-for-zemlianika?labelColor=555555&color=007EC6">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/OgrallSerebroust/test-assignment-for-zemlianika?labelColor=555555&color=007EC6">
    <img alt="GitHub Issues" src="https://img.shields.io/github/issues/OgrallSerebroust/test-assignment-for-zemlianika?labelColor=555555&color=007EC6">
    <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/OgrallSerebroust/test-assignment-for-zemlianika?labelColor=555555&color=007EC6">
</div>

<div align="center"><a href="README.ru.md">Русская версия</a></div>

<details>
    <summary>
        <strong>
            Table of Contents :bookmark_tabs:
        </strong>
    </summary>

- [Features :muscle:](#features-muscle)
- [Getting Started :seedling:](#getting-started-seedling)
  - [Prerequisites :page\_with\_curl:](#prerequisites-page_with_curl)
  - [Installation :inbox\_tray:](#installation-inbox_tray)
  - [Production configuration :rocket:](#production-configuration-rocket)
  - [Database migrations :floppy\_disk:](#database-migrations-floppy_disk)
- [API Reference :speech\_balloon:](#api-reference-speech_balloon)
  - [Base URL :trident:](#base-url-trident)
  - [Endpoints :round\_pushpin:](#endpoints-round_pushpin)
    - [Create an appeal](#create-an-appeal)
    - [Get all appeals](#get-all-appeals)
    - [Get an appeal](#get-an-appeal)
- [Demo :mag::computer:](#demo-magcomputer)
- [Decisions and Limitations :memo:](#decisions-and-limitations-memo)
  - [Stack and trade-offs](#stack-and-trade-offs)
  - [What is still missing](#what-is-still-missing)
  - [Task delivery and follow-up](#task-delivery-and-follow-up)
  - [AI assistance and verification](#ai-assistance-and-verification)
- [Built With :wrench:](#built-with-wrench)

</details>

## Features :muscle:

* **Appeal management** — Submit an appeal and open its details to check the current status and the failure reason, if any.
* **Appeal queue** — Browse the latest appeals, filter them by status, and navigate through the pages. The list has loading, empty, and error states.
* **Background processing** — A Celery worker picks up each appeal from Redis and simulates 2–5 seconds of work. An appeal moves from `queued` to `processing` and then to `done` or `failed`.
* **Retries and duplicate delivery** — The worker retries temporary errors with backoff. It locks the appeal row during processing and skips appeals that have already reached a final status.
* **REST API and OpenAPI** — Create appeals, retrieve a paginated list, and fetch individual records. The OpenAPI schema describes the available endpoints.

## Getting Started :seedling:

You can run the appeal queue locally with Docker Compose. Check the prerequisites and follow the steps below.

### Prerequisites :page_with_curl:

- **Git**
- **Docker** with **Docker Compose v2**

### Installation :inbox_tray:

1. Clone this repository and open the project directory.

   ```bash
   git clone https://github.com/OgrallSerebroust/test-assignment-for-zemlianika.git
   cd test-assignment-for-zemlianika
   ```

2. Copy `services/backend/.env.example` to `services/backend/.env`.

   ```bash
   cp services/backend/.env.example services/backend/.env
   ```

   In PowerShell, use `Copy-Item services/backend/.env.example services/backend/.env`. Set `DJANGO_SECRET_KEY` in the copied file to a non-empty secret for your local environment.

3. Build and start the containers.

   ```bash
   docker compose up --build
   ```

4. Open <http://localhost:8080>.

> [!NOTE]
> Compose starts the frontend, API, PostgreSQL, Redis, and a separate Celery worker. The `migrate` service applies database migrations before the API and worker start.

> [!TIP]
> For frontend development with Vite, run `docker compose -f compose.yaml -f compose.dev.yaml up --build`. The frontend is available at <http://localhost:5173>, and the API is also exposed directly on port `8000`.

### Production configuration :rocket:

Copy `services/backend/.env.prod.example` to `services/backend/.env.prod`. Set `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`, and include your deployment hostname in the JSON list in `DJANGO_ALLOWED_HOSTS`.

Run this command from the project root in PowerShell.

```powershell
docker compose --env-file ./services/backend/.env.prod -f .\compose.yaml -f .\compose.prod.yaml up --build -d
```

The frontend is exposed on port `8080` and the API on port `8000`. The override selects Django's production settings with `DEBUG=False`. The backend currently runs through Django's `runserver`.

### Database migrations :floppy_disk:

After changing the models in the `core` app, run this command from the project root.

```bash
docker compose -f compose.yaml -f compose.dev.yaml run --rm --no-deps backend manage makemigrations core
```

The development bind mount writes the migration files to `services/backend/apps/core/migrations/` on the host. The command generates migration files. The `migrate` service applies them when the stack starts.

## API Reference :speech_balloon:

### Base URL :trident:

```text
http://localhost:8080/api/
```

The OpenAPI schema is available at <http://localhost:8080/api/schema/>.

### Endpoints :round_pushpin:

Paths below are relative to the API base URL.

#### Create an appeal

**Endpoint** — `POST /appeals/`

Send a JSON body with the submitter's full name and the appeal text.

```json
{
    "full_name": "Jane Smith",
    "appeal": "Please check the status of my application."
}
```

**Response** — `201 Created` with the appeal object shown below. An invalid request body that fails field validation returns `422 Unprocessable Entity`.

#### Get all appeals

**Endpoint** — `GET /appeals/?status=queued&page=1`

Both query parameters are optional. `status` accepts `queued`, `processing`, `done`, or `failed`. The list is sorted newest first and has 20 appeals per page.

**Response** — `200 OK` with `count`, `next`, `previous`, and `results`. Each item in `results` has the same fields as the detail response. An invalid `status` returns `422 Unprocessable Entity`.

#### Get an appeal

**Endpoint** — `GET /appeals/1/`

**Response** — `200 OK` with the appeal object, or `404 Not Found` if the appeal does not exist.

```json
{
    "id": 1,
    "full_name": "Jane Smith",
    "appeal": "Please check the status of my application.",
    "status": "queued",
    "failure_reason": "",
    "created_at": "2026-11-28T09:00:00Z",
    "updated_at": "2026-11-28T09:00:00Z"
}
```

## Demo :mag::computer:

Open the local app, create an appeal, and return to the list. Refresh the page after a few seconds and open the appeal to check the result.

## Decisions and Limitations :memo:

### Stack and trade-offs

* **Django and DRF** — Django provides the ORM, migrations, and admin in one backend. DRF adds serializers and pagination, and drf-spectacular generates the OpenAPI schema.
* **React and TypeScript** — React splits the list, form, and details into reusable components. TypeScript describes the shape of API responses, and TanStack Query handles requests and loading states.
* **PostgreSQL** — Row locking lets workers coordinate access to an appeal, and a composite index supports filtering by status and sorting by creation time. The worker holds the row lock during the simulated work. Longer jobs or jobs with external side effects would benefit from shorter transactions and a durable idempotency mechanism.
* **Celery and Redis** — Celery provides retry and redelivery support with a separate worker process. Redis serves as the broker. PostgreSQL stores the appeal status and failure reason.

### What is still missing

* **Status polling** — The frontend loads statuses on request. Periodic updates on the list and detail pages are still pending.
* **Invalid status transitions** — The worker controls the normal lifecycle. The API still needs a way to reject invalid transitions with `409 Conflict`.
* **First-run setup** — A fresh checkout needs a local `.env` file and a Django secret key before Compose can start. This keeps the key out of the repository at the cost of a manual step.
* **Required tests** — The status transition tests, the worker failure test, and the API integration test are still pending.

### Task delivery and follow-up

* **Publishing after commit** — The API saves the appeal before publishing its ID to Redis. This lets the worker find the committed row. If publishing fails, the API logs the error and still returns `201 Created`. The appeal can stay `queued` indefinitely.
* **Recovery after failures** — Temporary worker errors are retried with backoff. A terminal processing error is logged and saved as `failed` with its reason. If PostgreSQL is unavailable after retries are exhausted, the worker may be unable to save that final status.
* **Durable delivery** — A transactional outbox could save the appeal and an event to publish in the same database transaction. A relay could retry publication and recover after a restart. This would add a table and a process to operate, and the worker would still need to handle duplicate delivery.

### AI assistance and verification

Codex assisted with the React and Docker setup, the Django settings migration, frontend realisation and the README. Frontend type checks and a build passed during frontend development. Django settings checks passed during the settings migration. 


## Built With :wrench:

[![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)](#)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)](#)
[![Django REST Framework](https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white)](#)
[![drf-spectacular](https://img.shields.io/badge/drf--spectacular-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)](#)
[![Pydantic Settings](https://img.shields.io/badge/Pydantic_Settings-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge)](#)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-9575cd?logo=vite&logoColor=fff&style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Oxlint](https://img.shields.io/badge/Oxlint-242424?style=for-the-badge)](#)
[![CSS Modules](https://img.shields.io/badge/CSS_Modules-1572B6?style=for-the-badge&logo=cssmodules&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](#)
[![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](#)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](#)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#)