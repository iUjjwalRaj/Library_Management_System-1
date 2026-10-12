# Project Tasks & Member Responsibilities

This document outlines the assigned tasks, pull requests, and scope of work for each team member in the Library Management System project.

---

## Member 1 — Prakhar Raj
### Book Management Backend
**Scope**: 5 PRs • Owns the Book model, book controllers/routes, and book API tests.

| PR | PR Title | Work to Implement |
| :---: | :--- | :--- |
| **1** | `feat: add Book model` | Create the Mongoose Book schema with title, author, ISBN, category, publisher, publication year, and total/available copies. |
| **2** | `feat: implement book CRUD APIs` | Implement create, list, get-by-ID, update, and delete endpoints using Express controllers and routes. |
| **3** | `feat: validate book data` | Validate required fields, ISBN uniqueness, numeric values, and copy counts; return meaningful validation errors. |
| **4** | `feat: add book search and filters` | Search by title, author, or ISBN; filter by category and availability. |
| **5** | `test: cover book management APIs` | Add tests for CRUD operations, missing records, duplicate ISBNs, and invalid inputs. |

> **Acceptance Criteria**: All five book CRUD endpoints work, data persists in MongoDB Atlas, and search/filter results are correct.

---

## Member 2 — Bhavesh Pandey
### Authentication, Authorization and Issue/Return
**Scope**: 5 PRs • Owns authentication, Admin/User authorization, and book circulation APIs.

| PR | PR Title | Work to Implement |
| :---: | :--- | :--- |
| **1** | `feat: add User model and auth APIs` | Create the User model and registration/login endpoints, with securely hashed passwords. |
| **2** | `feat: add JWT authentication` | Implement token verification middleware and a protected current-user endpoint. |
| **3** | `feat: enforce Admin and User roles` | Implement role-based middleware. Only Admins can manage book records; normal users can browse/search books. |
| **4** | `feat: implement book issue and return APIs` | Create issue records and endpoints for issuing and returning books, with availability checks and copy-count updates. |
| **5** | `test: cover authentication and circulation` | Test login failures, protected routes, role restrictions, issuing unavailable books, and returning books. |

---

## Member 3 — Ujjwal Raj
### React Frontend
**Scope**: 5 PRs • Owns the React application, pages, navigation, and user-facing library operations.

| PR | PR Title | Work to Implement |
| :---: | :--- | :--- |
| **1** | `feat: scaffold React app and routing` | Set up React + Vite, React Router, reusable layout, navigation, and page structure. |
| **2** | `feat: add login and registration pages` | Build controlled forms, call authentication APIs, and handle login errors and session state. |
| **3** | `feat: build searchable book catalogue` | Display books fetched from the backend, with title/author search, category filters, and loading/empty/error states. |
| **4** | `feat: add admin book management UI` | Build add/edit forms, delete confirmation, and book-management views, with Admin-only controls. |
| **5** | `feat: add issue and return interface` | Build the user's issued-books/history view, issue actions, return actions, and relevant status messages. |

> **Acceptance Criteria**: The frontend calls real backend APIs using fetch or Axios and uses useState, useEffect, controlled inputs, and React Router. Main functionality must not depend on hardcoded book data.
