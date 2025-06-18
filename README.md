
# IP Management System

## Overview

The IP Management System is a web application designed to efficiently manage IP addresses and their associated devices. It includes user authentication (login/signup) and provides features to add, edit, delete, and filter IP addresses based on usage (used/unused).

This project uses **Node.js** and **Express** for the backend, and **React** for the frontend. There are two backend servers:
- One for **user authentication** (`server.js`)
- One for **IP data management** (`server1.js`)

The frontend provides a clean and responsive interface with login and signup functionalities.

---

## Table of Contents

1. [Technologies](#technologies)  
2. [Installation](#installation)  
3. [Backend Setup](#backend-setup)  
4. [Frontend Setup](#frontend-setup)  
5. [API Endpoints](#api-endpoints)  
6. [Project Flow](#project-flow)  
7. [License](#license)  

---

## Technologies

- **Frontend:** React, Axios  
- **Backend:** Node.js, Express (Two servers)  
- **Data Storage:** JSON files (`users.json`, `data.json`)  
- **Styling:** CSS  

---

## Installation

### Prerequisites

- Node.js (v14 or above)  
- npm (Node Package Manager)  
- Git (optional)

---

## Backend Setup

There are **two backend servers**:

### 1. User Authentication Server (`server.js`)

Handles:
- User **signup**
- User **login**
- Stores credentials in `users.json`

```bash
cd backend
npm install
node server.js
```

Runs on: **http://localhost:5000**

---

### 2. IP Data Management Server (`server1.js`)

Handles:
- Add/Edit/Delete IP addresses
- Fetch used/unused IPs
- Stores IP data in `data.json`

```bash
node server1.js
```

Runs on: **http://localhost:5001**

---

## Frontend Setup

```bash
cd ip-management
npm install
npm start
```

Runs on: **http://localhost:3000**

---

## API Endpoints

### Authentication Server (`server.js`)

- **POST `/register`** – Registers a new user  
  - Payload: `{ name, email, password }`

- **POST `/login`** – Logs in an existing user  
  - Payload: `{ email, password }`

---

### IP Management Server (`server1.js`)

- **GET `/ips`** – Get all used IP addresses  
- **GET `/unused-ips`** – Get unused IPs in the range `172.16.92.x` to `172.16.95.x`  
- **POST `/ips`** – Add new IP  
- **PUT `/ips/:id`** – Update an existing IP by ID  
- **DELETE `/ips/:id`** – Delete an IP by ID  

---

## Project Flow

### 1. Login/Signup

- Users must **sign up** or **log in** to use the IP management system.
- Credentials are validated using the `users.json` file on the backend.

### 2. IP Management

- After login, users can:
  - Add a new IP address (with validation: `172.16.92.x` to `172.16.95.x`)
  - Edit existing IP details
  - Delete IP records
  - Filter IPs (All / Used / Unused)

### 3. Data Handling

- All IP data is stored in `data.json`
- All user credentials are stored in `users.json`
- Data is persisted between server restarts

---

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

---
