<h3 align="center">
    Тестовое задание для Земляники
</h3>
<div align="center">
    Сервис «Очередь обращений» для тестового задания веб-студии «Земляника».
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

<div align="center"><a href="README.md">English version</a></div>

<details>
    <summary>
        <strong>
            Содержание :bookmark_tabs:
        </strong>
    </summary>

- [Возможности :muscle:](#возможности-muscle)
- [Быстрый старт :seedling:](#быстрый-старт-seedling)
  - [Требования :page\_with\_curl:](#требования-page_with_curl)
  - [Установка :inbox\_tray:](#установка-inbox_tray)
  - [Конфигурация для продакшена :rocket:](#конфигурация-для-продакшена-rocket)
  - [Миграции базы данных :floppy\_disk:](#миграции-базы-данных-floppy_disk)
- [Справочник API :speech\_balloon:](#справочник-api-speech_balloon)
  - [Базовый URL :trident:](#базовый-url-trident)
  - [Методы API :round\_pushpin:](#методы-api-round_pushpin)
    - [Создать обращение](#создать-обращение)
    - [Получить список обращений](#получить-список-обращений)
    - [Получить обращение](#получить-обращение)
- [Демонстрация :mag::computer:](#демонстрация-magcomputer)
- [Решения и ограничения :memo:](#решения-и-ограничения-memo)
  - [Стек и компромиссы](#стек-и-компромиссы)
  - [Что ещё не сделано](#что-ещё-не-сделано)
  - [Доставка задач и дальнейшие шаги](#доставка-задач-и-дальнейшие-шаги)
  - [Использование ИИ и проверка](#использование-ии-и-проверка)
- [Технологии :wrench:](#технологии-wrench)

</details>

## Возможности :muscle:

* **Работа с обращениями** — создайте обращение и откройте карточку, чтобы узнать текущий статус и причину ошибки, если она возникла.
* **Очередь обращений** — просматривайте обращения, фильтруйте их по статусу и переключайтесь между страницами. Список показывает состояния загрузки, ошибки и отсутствия результатов.
* **Фоновая обработка** — воркер Celery получает задачи из Redis и имитирует обработку в течение 2–5 секунд. Обращение переходит из `queued` в `processing`, а затем в `done` или `failed`.
* **Повторные попытки и повторная доставка** — при временной ошибке воркер повторяет обработку с увеличивающейся задержкой. Во время работы он блокирует строку обращения и пропускает обращения в конечном статусе.
* **REST API и OpenAPI** — API позволяет создать обращение, получить список с пагинацией и открыть отдельное обращение. Схема OpenAPI описывает доступные методы.

## Быстрый старт :seedling:

Очередь обращений можно запустить локально через Docker Compose. Установите необходимые инструменты и выполните шаги ниже.

### Требования :page_with_curl:

- **Git**
- **Docker** с **Docker Compose v2**

### Установка :inbox_tray:

1. Клонируйте репозиторий и перейдите в папку проекта.

   ```bash
   git clone https://github.com/OgrallSerebroust/test-assignment-for-zemlianika.git
   cd test-assignment-for-zemlianika
   ```

2. Скопируйте `services/backend/.env.example` в `services/backend/.env`.

   ```bash
   cp services/backend/.env.example services/backend/.env
   ```

   В PowerShell используйте `Copy-Item services/backend/.env.example services/backend/.env`. В скопированном файле задайте непустое значение `DJANGO_SECRET_KEY` для локального окружения.

3. Соберите и запустите контейнеры.

   ```bash
   docker compose up --build
   ```

4. Откройте <http://localhost:8080>.

> [!NOTE]
> Compose запускает фронтенд, API, PostgreSQL, Redis и отдельный воркер Celery. Сервис `migrate` применяет миграции базы данных перед запуском API и воркера.

> [!TIP]
> Для разработки фронтенда с Vite выполните `docker compose -f compose.yaml -f compose.dev.yaml up --build`. Фронтенд доступен по адресу <http://localhost:5173>. К API также можно обращаться напрямую через порт `8000`.

### Конфигурация для продакшена :rocket:

Скопируйте `services/backend/.env.prod.example` в `services/backend/.env.prod`. Задайте `DJANGO_SECRET_KEY` и `POSTGRES_PASSWORD`, а в JSON-список `DJANGO_ALLOWED_HOSTS` добавьте имя хоста, на котором будет доступно приложение.

Выполните команду из корня проекта в PowerShell.

```powershell
docker compose --env-file ./services/backend/.env.prod -f .\compose.yaml -f .\compose.prod.yaml up --build -d
```

Фронтенд доступен на порту `8080`, API — на порту `8000`. Конфигурация включает настройки Django для продакшена с `DEBUG=False`. Бэкенд пока запускается через Django `runserver`.

### Миграции базы данных :floppy_disk:

После изменения моделей приложения `core` выполните команду из корня проекта.

```bash
docker compose -f compose.yaml -f compose.dev.yaml run --rm --no-deps backend manage makemigrations core
```

Благодаря монтированию каталога в dev-конфигурации файлы миграций появятся в `services/backend/apps/core/migrations/` на хосте. Эта команда генерирует файлы миграций. Сервис `migrate` применяет их при запуске стека.

## Справочник API :speech_balloon:

### Базовый URL :trident:

```text
http://localhost:8080/api/
```

Схема OpenAPI доступна по адресу <http://localhost:8080/api/schema/>.

### Методы API :round_pushpin:

Пути ниже указаны относительно базового URL API.

#### Создать обращение

**Метод** — `POST /appeals/`

Передайте в теле JSON полное имя отправителя и текст обращения.

```json
{
    "full_name": "Jane Smith",
    "appeal": "Please check the status of my application."
}
```

**Ответ** — `201 Created` с объектом обращения. Пример объекта приведён ниже. При ошибке валидации полей запроса API возвращает `422 Unprocessable Entity`.

#### Получить список обращений

**Метод** — `GET /appeals/?status=queued&page=1`

Оба параметра необязательны. Параметр `status` принимает значения `queued`, `processing`, `done` и `failed`. Новые обращения идут первыми, по 20 на страницу.

**Ответ** — `200 OK` с полями `count`, `next`, `previous` и `results`. Каждый элемент `results` содержит те же поля, что и ответ с отдельным обращением. При недопустимом значении `status` API возвращает `422 Unprocessable Entity`.

#### Получить обращение

**Метод** — `GET /appeals/1/`

**Ответ** — `200 OK` с объектом обращения или `404 Not Found`, если обращение отсутствует.

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

## Демонстрация :mag::computer:

Откройте локальное приложение, создайте обращение и вернитесь к списку. Через несколько секунд обновите страницу и откройте карточку обращения, чтобы проверить результат.

## Решения и ограничения :memo:

### Стек и компромиссы

* **Django и DRF** — Django предоставляет ORM, миграции и административную панель. DRF добавляет сериализаторы и пагинацию, а drf-spectacular генерирует схему OpenAPI.
* **React и TypeScript** — список, форма и карточка собраны из переиспользуемых компонентов React. TypeScript описывает структуру ответов API, а TanStack Query управляет запросами и состояниями загрузки.
* **PostgreSQL** — блокировка строк координирует доступ воркеров к обращению, а составной индекс поддерживает фильтрацию по статусу и сортировку по времени создания. Воркер удерживает блокировку на время обработки. Для долгих задач или операций с внешними эффектами пригодятся короткие транзакции и механизм идемпотентности с сохранением состояния.
* **Celery и Redis** — Celery поддерживает повторные попытки и повторную доставку в отдельном процессе воркера. Redis служит брокером, а PostgreSQL хранит статус обращения и причину ошибки.

### Что ещё не сделано

* **Автообновление статусов** — фронтенд получает статусы при запросе данных. Периодическое обновление списка и карточки ещё предстоит добавить.
* **Недопустимые переходы статусов** — штатным жизненным циклом управляет воркер. Для недопустимых переходов API ещё предстоит возвращать `409 Conflict`.
* **Подготовка первого запуска** — после клонирования нужно создать локальный `.env` и задать секретный ключ Django. Так ключ хранится вне репозитория, но появляется ручной шаг перед запуском Compose.
* **Обязательные тесты** — предстоит добавить тесты переходов статусов, тест ошибки воркера и интеграционный тест API.

### Доставка задач и дальнейшие шаги

* **Публикация после коммита** — API сохраняет обращение перед отправкой его идентификатора в Redis, чтобы воркер мог найти запись в базе. При сбое публикации API пишет ошибку в лог и всё равно возвращает `201 Created`. Обращение может остаться в статусе `queued` на неопределённый срок.
* **Восстановление после сбоев** — при временных ошибках воркер повторяет попытки с увеличивающейся задержкой. При окончательной ошибке обработки он пишет её в лог и сохраняет статус `failed` с причиной. Если PostgreSQL недоступен после исчерпания попыток, воркер может не сохранить итоговый статус.
* **Надёжная доставка** — transactional outbox позволит сохранять обращение и событие для публикации в одной транзакции. Отдельный процесс сможет повторять публикацию и продолжать работу после перезапуска. Понадобятся дополнительная таблица и процесс, а воркеру по-прежнему нужно будет учитывать повторную доставку.

### Использование ИИ и проверка

Codex помог с настройкой React и Docker, переносом настроек Django, реализацией фронтенда и подготовкой README. Во время разработки фронтенда прошли проверка типов и сборка. При переносе настроек прошли проверки Django.


## Технологии :wrench:

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