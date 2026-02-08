# Blog Management Platform

A RESTful API for managing blogs with user authentication and role-based access control. Built with Node.js, Express, and MySQL.

## Features

- User authentication (register, login, logout)
- Role-based access control (admin, user)
- CRUD operations for blog posts
- JWT-based authentication
- Docker support for easy deployment

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Containerization**: Docker & Docker Compose

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/musaraf0101/Blog-Management-Platform.git
cd Blog-Management-Platform
```

### 2. Environment Configuration

Navigate to the `blog_management_platform` directory and create a `.env` file:

```bash
cd blog_management_platform
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_user_name
DB_PASSWORD=your_db_password
DATABASE=your_db_name

JWT_SECRET=your-access-token-secret
JWT_EXPIRES=7d
```

### 3. Database Setup

Create the database and tables using the SQL schemas provided:

```bash
mysql -u your_user_name -p
```

Then run:

```sql
CREATE DATABASE your_db_name;
USE your_db_name;

-- Run the schemas from src/shemas/user.sql and src/shemas/blog.sql
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

**Development mode:**

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## How to Run with Docker

Docker Compose simplifies the deployment by automatically setting up both MySQL and the backend application.

### 1. Ensure Docker is Running

Make sure Docker Desktop is running on your system.

### 2. Configure Environment Variables

Edit `blog_management_platform/.env` with your desired configuration. For Docker deployment, use:

```env
PORT=5000

DB_HOST=mysql
DB_USER=root
DB_PASSWORD=your_db_password
DATABASE=your_db_name

JWT_SECRET=your-access-token-secret
JWT_EXPIRES=7d
```

**Note**: Set `DB_HOST=mysql` (the service name in docker-compose.yml) instead of `localhost`.

### 3. Build and Start Containers

From the root directory:

```bash
docker-compose up --build
```

This will:

- Pull the MySQL 8.0 image
- Build the backend application
- Start both services
- Create a persistent volume for MySQL data

### 4. Initialize Database

Once containers are running, access the MySQL container:

```bash
docker exec -it mysql mysql -u root -p
```

Create the database and run the schemas:

```sql
CREATE DATABASE your_db_name;
USE your_db_name;

-- Copy and paste content from src/shemas/user.sql
-- Copy and paste content from src/shemas/blog.sql
```

### 5. Access the Application

The API will be available at `http://localhost:5000`

### Docker Commands

```bash
# Start containers
docker-compose up
```

## API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: Returns JWT token in cookie

#### Logout

```http
POST /auth/logout
```

### User Endpoints

All user endpoints require authentication (JWT token in cookie).

#### Get All Users (Admin Only)

```http
GET /users
Authorization: Bearer <token>
```

#### Get User by ID

```http
GET /users/:id
Authorization: Bearer <token>
```

### Blog Endpoints

All blog endpoints require authentication.

#### Get All Blogs

```http
GET /blogs
Authorization: Bearer <token>
```

#### Get Blog by ID

```http
GET /blogs/:id
Authorization: Bearer <token>
```

#### Create Blog Post

```http
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog",
  "content": "This is the content of my blog post."
}
```

#### Update Blog Post

```http
PUT /blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content."
}
```

**Note**: Users can update their own posts

#### Delete Blog Post (Admin Only)

```http
DELETE /blogs/:id
Authorization: Bearer <token>
```

### Authentication

The API uses JWT tokens stored in HTTP-only cookies. After successful login, the token is automatically included in subsequent requests.

### Role-Based Access Control

- **user**: Can create, read, and update their own blog posts
- **admin**: Full access to all endpoints including user management and deleting any blog post

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Unique identifier (auto-increment)
- `name`: User's full name
- `email`: Unique email address for login
- `password`: Hashed password (bcrypt)
- `role`: User role (user or admin)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Blogs Table

```sql
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier (auto-increment)
- `user_id`: Foreign key referencing users table
- `title`: Blog post title
- `content`: Blog post content
- `created_at`: Post creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**

- One-to-Many: One user can have multiple blog posts
- Cascade Delete: When a user is deleted, all their blog posts are automatically deleted

## Project Structure

```
blog_management_platform/
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   ├── dbConfig.js        # Database configuration
│   │   └── token.js           # JWT token utilities
│   ├── controllers/
│   │   ├── auth.controller.js # Authentication logic
│   │   ├── blog.controller.js # Blog CRUD operations
│   │   └── user.controller.js # User operations
│   ├── middleware/
│   │   ├── role.js            # Role-based access control
│   │   └── verifyToken.js     # JWT verification
│   ├── models/
│   │   ├── Blog.js            # Blog model
│   │   └── User.js            # User model
│   ├── routes/
│   │   ├── auth.routes.js     # Authentication routes
│   │   ├── blog.routes.js     # Blog routes
│   │   └── user.routes.js     # User routes
│   └── shemas/
│       ├── blog.sql           # Blog table schema
│       └── user.sql           # User table schema
├── .env                       # Environment variables
├── .env.example               # Environment template
├── Dockerfile                 # Docker configuration
├── package.json               # Dependencies
└── server.js                  # Application entry point
```

## API Collections

Postman collections are available in the `api collections` directory for testing:

- `auth.postman_collection.json` - Authentication endpoints
- `blogs.postman_collection.json` - Blog endpoints
- `users.postman_collection.json` - User endpoints

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- HTTP-only cookies for token storage
- Role-based access control
- SQL injection protection via parameterized queries

## CORS Configuration

The API allows requests from:

- `http://localhost:5173`
- `http://localhost:5174`

To modify allowed origins, edit the CORS configuration in `server.js`.
