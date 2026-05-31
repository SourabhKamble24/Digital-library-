# 📚 Digital Library Application

A full-stack web application that enables users to browse, search, borrow, and manage books through a modern digital library system. The application includes secure authentication, inventory management, a borrowing workflow, and a personalized user dashboard.

## ✨ Features

### 🔐 User Authentication

* Secure user registration and login
* Password hashing with bcrypt
* JWT-based authentication and authorization
* Protected routes for authenticated users

### 📖 Book Catalog

* Browse books across multiple categories
* Attractive book cover displays
* Real-time availability tracking
* Detailed book information

### 🔍 Search & Filtering

* Search books by title or author
* Filter books by category
* Fast and intuitive browsing experience

### 🛒 Shopping Cart

* Add available books to a personal cart
* Remove books from the cart
* Review selections before borrowing

### 📦 Borrowing & Checkout System

* Borrow individual books instantly or checkout multiple books at once
* Automatic due date generation (14 days from checkout)
* Inventory updates handled through database transactions
* Prevents borrowing unavailable books

### 👤 User Dashboard

* View currently borrowed books
* Return borrowed books
* Automatically restore inventory upon return
* Access complete borrowing history

---

## 🛠️ Technology Stack

### Frontend

* React.js (Vite)
* Tailwind CSS v4
* React Router
* Axios
* Lucide React

### Backend

* Node.js
* Express.js
* PostgreSQL (Supabase)
* pg
* JSON Web Tokens (JWT)
* bcrypt

---

## 🗄️ Database

The application uses Supabase PostgreSQL as its primary database.

### Tables

* users
* categories
* books
* cart_items
* borrow_records

### Transaction-Based Inventory Management

Checkout operations run inside PostgreSQL transactions to ensure data consistency. Book inventory updates and borrow record creation succeed or fail together, preventing partial updates and maintaining accurate stock counts.

---

## 🚀 Setup & Installation

### Prerequisites

Before getting started, ensure you have:

* Node.js installed
* A Supabase account
* A PostgreSQL database configured through Supabase

---

### 1. Database Setup

Run the SQL migration files located in:

```bash
backend/supabase/migrations/
```

Execute them in the Supabase SQL Editor to create the required tables and relationships.

---

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file:

```env
DATABASE_URL=your_supabase_postgresql_connection_string
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend application:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
digital-library/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   ├── supabase/
│   └── ...
│
└── README.md
```

---

## 🌐 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint  | Description                               |
| ------ | --------- | ----------------------------------------- |
| POST   | `/signup` | Register a new user                       |
| POST   | `/login`  | Authenticate a user                       |
| GET    | `/me`     | Retrieve the authenticated user's profile |

---

### Books & Categories

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | `/api/books`      | Fetch all books      |
| GET    | `/api/categories` | Fetch all categories |

---

### Cart (`/api/cart`) — Protected

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/`            | Retrieve cart items |
| POST   | `/:bookId`     | Add a book to cart  |
| DELETE | `/:cartItemId` | Remove a cart item  |

---

### Borrowing (`/api/borrow`) — Protected

| Method | Endpoint            | Description                |
| ------ | ------------------- | -------------------------- |
| POST   | `/checkout`         | Checkout all cart items    |
| POST   | `/:bookId`          | Borrow a single book       |
| POST   | `/return/:recordId` | Return a borrowed book     |
| GET    | `/history`          | Retrieve borrowing history |

---

## 🔒 Security Features

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Secure database transactions
* Inventory consistency checks
* Input validation and error handling

---



## ❤️ Acknowledgements

Built with passion for learning, reading, and modern web development.

Developed by Sourabh kamble❤️.
