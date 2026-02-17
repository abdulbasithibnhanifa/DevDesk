# DevDesk 🛠️

DevDesk is a comprehensive project management and help desk solution built with the MERN stack (MongoDB, Express.js, React, Node.js). It is designed to streamline development workflows, manage tickets, and facilitate collaboration within development teams.

## 🚀 Features

-   **Project Management**: Create, update, and manage multiple projects.
-   **Ticket System**: Efficiently track issues, bugs, and feature requests.
-   **User Authentication**: Secure login and registration using JWT.
-   **Responsive Design**: Built with Bootstrap and React for a seamless experience across devices.
-   **RESTful API**: Robust backend API handling data operations.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, Bootstrap, Axios, React Router.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (with Mongoose).
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.js.
-   **Tools**: ESLint, Nodemon.

## 📂 Project Structure

```bash
DevDesk/
├── client/         # React Frontend
│   ├── src/        # Source code
│   ├── public/     # Static assets
│   └── ...
├── server/         # Node.js/Express Backend
│   ├── src/        # Server logic
│   └── ...
└── ...
```

## ⚙️ Installation & Setup

### Prerequisites

-   Node.js (v18+ recommended)
-   MongoDB (Local or Atlas)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/abdulbasithibnhanifa/DevDesk.git
cd DevDesk
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other necessary variables
```

Start the backend server:

```bash
npm start
# OR for development with nodemon
npm run startdev
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory if required (e.g., for API base URL):

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

## 🔒 Security Note

Sensitive files such as `.env` and error logs are excluded from version control to ensure security. Please ensure you configure your local environment variables correctly before running the application.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
