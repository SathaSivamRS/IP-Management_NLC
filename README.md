# IP Management Application

This is a web-based application for managing and assigning IP addresses to devices. It allows users to view available IP addresses, add new IP addresses, edit existing entries, and delete unused IP addresses. The application uses **Node.js** and **Express** for the backend and **HTML**, **CSS**, and **JavaScript** for the frontend.

## Features

- **View all IPs**: Displays a table of all assigned IP addresses with their corresponding device names and types.
- **View unused IPs**: Shows available IP addresses for assignment.
- **Add a new IP**: Allows users to add a new IP address and assign it to a device.
- **Edit an IP**: Users can edit the device details for an existing IP address.
- **Delete an IP**: Users can remove an IP address from the system.

## Technologies Used

- **Frontend**:
  - HTML
  - CSS
  - JavaScript
- **Backend**:
  - Node.js
  - Express.js
  - Body-parser
  - CORS (Cross-Origin Resource Sharing)
  - File System (for data storage)
- **Styling**: Custom styling with CSS and animations.

## Installation

### Prerequisites

- **Node.js** installed on your machine.
- **npm** (Node Package Manager) for managing dependencies.

### Steps to Set Up Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/ip-management-app.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd ip-management-app
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the application**:

   ```bash
   node server.js
   ```

   The application will start on `http://localhost:5000`.

## Usage

- The main page will display a form to add IP addresses and a table listing existing IPs.
- You can also filter and manage the IPs through the available buttons (Add, Edit, Delete).

### API Endpoints

- **GET /ips**: Fetch all IP addresses and their details.
- **GET /unused-ips**: Fetch all available (unused) IP addresses.
- **POST /ips**: Add a new IP address.
- **PUT /ips/:id**: Edit an existing IP address.
- **DELETE /ips/:id**: Delete an IP address.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. Contributions are always welcome!

### Steps to Contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-branch`).
6. Submit a pull request.

## License

This project is licensed under the Apache2.0 License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify or add additional details to the README as per your project's requirements!