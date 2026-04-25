# Course Registration Project

The Course Registration System is a web-based application developed to improve the existing course enrollment process at IIT Kanpur with some extra features.

Students can browse available courses, submit enrollment requests, and track their registration status in real time. Professors can manage course offerings, define prerequisites, and oversee the allocation process.

The system uses role-based access control to provide secure and relevant access to each user type. It also incorporates automated, rule-based seat allocation, reducing manual effort and making the process more efficient, transparent, and fair.

## Team Members

Durbasmriti Saha (230393)

Reddi Pallavi (230850)

Jyothika Seru (230946)

Aayushman Kumar (230039)

## Tech stack

- Backend: Node.js, Express.js

- Database: MySQL

- Database Driver: mysql2

  ## Prerequisites

- Node.js (v14 or higher)

- MySQL Server

- Git

  ## Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/durbasmriti/course-registration-system.git](https://github.com/durbasmriti/course-registration-system.git)
cd course-registration-system
```

### 2. Install Dependencies
Navigate to the project root and install the required npm packages:
```bash
npm install
```
### 3. Database Setup
Open your MySQL terminal or a tool like MySQL Workbench.

Create a new database:
```bash
CREATE DATABASE course_registration;
USE course_registration;
```
Execute the `schema.sql` and `seed.sql` scripts (found in \backend\database)

### 4. Configuration
Create a .env file in the root directory and add your database credentials:
```bash
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=course_registration
PORT=3000
```
### 5. Running the Application

This project is split into a **Backend (Node.js/Express)** and a **Frontend**. You will need to open two terminal windows to run them simultaneously.

#### 1. Start the Backend
Navigate to the backend directory:
```bash
# From the project root
cd backend
npm install
npm start
```

#### 2. Start the Frontend
In a new terminal window, navigate to your frontend directory:

```bash
cd frontend  # or your specific frontend folder name
npm install
npm start
```
