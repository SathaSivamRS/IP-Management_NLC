# IP Management System

## Overview

The IP Management System is a web application designed to efficiently manage IP addresses, their associated devices, and their usage. The application allows users to add, edit, delete, and view IP addresses with corresponding device details. It also provides a filtering mechanism to easily sort IPs based on their usage (used or unused).

This project is built using **Node.js** for the backend and **React** for the frontend. The backend manages the data and provides APIs to interact with IP addresses, while the frontend provides a user-friendly interface to perform operations like adding, updating, deleting, and filtering IPs.

## Table of Contents

1. [Technologies](#technologies)  
2. [Installation](#installation)  
3. [Backend Setup](#backend-setup)  
4. [Frontend Setup](#frontend-setup)  
5. [API Endpoints](#api-endpoints)  
6. [Project Flow](#project-flow)  
7. [License](#license)  

## Technologies

- **Backend:** Node.js, Express  
- **Frontend:** React, Axios  
- **Database/File:** JSON file to store data  
- **Styling:** CSS (with animations and modern design)  

## Installation

### Prerequisites

1. **Node.js** (version 14.x or above)  
2. **npm** (Node Package Manager)  
3. **Git** (optional, for version control)  

### Backend Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SathaSivamRS/IP-Management_NLC.git
   cd backend
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```
   - The backend server will run on **http://localhost:5000**.

### Frontend Installation

1. Navigate to the `ip-management` folder:
   ```bash
   cd ip-management
   ```

2. To Install the new React project:
   ```bash
   npx create-react-app new_project_name 
   ```

3. Navigate to the created React app folder:
   ```bash
   cd new_project_name
   ```

4. Install the required frontend dependencies:
   ```bash
   npm install
   ```

5. Start the React development server:
   ```bash
   npm start
   ```
   - The frontend application will run on **http://localhost:3000**.

---

## Backend Setup

The backend is a simple Node.js server built with **Express**. It serves as the API for handling the CRUD operations on IP addresses and their corresponding devices. The server exposes the following API endpoints:

### API Endpoints

- **GET `/ips`** – Fetches all IP addresses along with their associated device information.  
- **GET `/unused-ips`** – Fetches all unused IP addresses in the range `172.16.92.x` to `172.16.95.x`.  
- **POST `/ips`** – Adds a new IP address along with device details.  
  - Payload: `{ ipAddress: string, deviceName: string, deviceType: string }`  
- **PUT `/ips/:id`** – Updates an existing IP address and its associated device information.  
  - URL Parameter: `id` (IP entry ID)  
  - Payload: `{ ipAddress: string, deviceName: string, deviceType: string }`  
- **DELETE `/ips/:id`** – Deletes an existing IP address and its corresponding device information.  
  - URL Parameter: `id` (IP entry ID)  

---

## Project Flow

### 1. **Frontend and Backend Communication**

- The frontend interacts with the backend through the API endpoints mentioned above.  
- The frontend (React) uses **Axios** to make HTTP requests to the backend.

### 2. **Add New IP**

   - Users can enter an **IP address**, **device name**, and **device type** to add a new IP to the system.  
   - The form will trigger a **POST** request to the backend API `/ips` to save the new IP data in the `data.json` file.

### 3. **Edit Existing IP**

   - Users can update the details of an existing IP by selecting the "Edit" button.  
   - The updated data will be sent to the backend via a **PUT** request to `/ips/:id`.

### 4. **Delete IP**

   - Users can delete any IP by clicking the "Delete" button associated with the IP.  
   - A **DELETE** request will be sent to `/ips/:id` to remove the IP from the backend.

### 5. **Filter IPs**

   - Users can filter IPs based on their usage (used or unused) using the "Filter" button.  
   - The frontend makes **GET** requests to `/ips` and `/unused-ips` based on the selected filter.

### 6. **Backend Data Handling**

   - The backend reads and writes data to a `data.json` file. If the file does not exist, it is created automatically.  
   - Each entry in the file contains an **IP address**, **device name**, and **device type**.

---

## License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for more details.  

---
