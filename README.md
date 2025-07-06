Sure! Here’s the full README file content in one block. You can just copy this entire text into your `README.md` file:

````markdown
# Bug Tracker API

A simple bug tracking REST API built with **Express**, **MySQL**, and **Sequelize** featuring JWT authentication and role-based access control.

---

## Features

- User signup & login with roles: admin, tester, developer  
- JWT-based authentication middleware  
- Admin-only project creation linked by user email (foreign key)  
- Sequelize migrations and models  
- Role-based route protection  

---

## Project Setup

### 1. Create Project Folder & Initialize

```bash
mkdir bug-tracker
cd bug-tracker
npm init -y
````

### 2. Install Dependencies

```bash
npm install express sequelize mysql2 dotenv bcryptjs jsonwebtoken
npm install --save-dev sequelize-cli nodemon
```

### 3. Initialize Sequelize

```bash
npx sequelize-cli init
```

This creates the folders:

* `config/`
* `models/`
* `migrations/`
* `seeders/`

---

## Environment Variables

Create a `.env` file in the project root:

```env
DB_NAME=bug_tracker
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_DIALECT=mysql
PORT=5000
JWT_SECRET=supersecuretoken
```

---

## Sequelize Configuration

Edit `config/config.js`:

```js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
```

---

## Database Setup

### Create the Database

```bash
npx sequelize-cli db:create
```

---

## Models & Migrations

### Create User Model and Migration

```bash
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:enum:{admin,tester,developer}
```

### Create Project Model and Migration

```bash
npx sequelize-cli model:generate --name Project --attributes email:string,name:string,details:text,assignedTester:string
```

**Important:**
Edit the generated migration file for `Project` in `migrations/` to add a foreign key constraint on `email` referencing `Users.email`:

```js
email: {
  type: Sequelize.STRING,
  allowNull: false,
  references: {
    model: 'Users',
    key: 'email',
  },
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
},
```

### Run Migrations

```bash
npx sequelize-cli db:migrate
```

### Undo Last Migration

```bash
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations

```bash
npx sequelize-cli db:migrate:undo:all
```

---

## Running the Server

Add these scripts to your `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Run the development server:

```bash
npm run dev
```

Server listens on port defined in `.env` (default 5000).

---

## API Endpoints

| Method | Endpoint      | Description                | Auth Required | Roles Allowed |
| ------ | ------------- | -------------------------- | ------------- | ------------- |
| POST   | /api/signup   | Register new user          | No            | N/A           |
| POST   | /api/login    | User login and get JWT     | No            | N/A           |
| GET    | /api/profile  | Get logged-in user profile | Yes           | All roles     |
| POST   | /api/projects | Create a new project       | Yes           | Admin only    |

---

## Testing the APIs

Use tools like **Postman**, **Thunder Client**, or **curl**.

### Example: Create a Project (Admin Only)

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: YOUR_ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bug Tracker App","details":"A project tracking bugs","assignedTester":"tester@example.com"}'
```

---

## Notes

* Ensure MySQL server is running before starting the project.
* Use valid JWT tokens in the `Authorization` header for protected routes.
* Passwords are securely hashed with `bcryptjs`.
* Adjust `.env` values to match your local environment.

```
