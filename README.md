# DevDesk 🛠️

DevDesk is a comprehensive project management and help desk solution built with the MERN stack (MongoDB, Express.js, React, Node.js). It is designed to streamline development workflows, manage tickets, and facilitate collaboration within development teams.

## 🚀 Features

-   **Project Management**: Create, update, and manage multiple projects.
-   **Ticket System**: Efficiently track issues, bugs, and feature requests.
-   **Secure Authentication (Upgraded v2)**: Enterprise-grade session security using HttpOnly Cookies and Refresh Token Rotation.
-   **Responsive Design**: Built with Bootstrap and React for a seamless experience across devices.
-   **RESTful API**: Robust backend API handling secure data operations.

## 🛡️ Secure Authentication Architecture (Upgraded)

DevDesk completely avoids the inherent security risks of `localStorage` JWTs (which are vulnerable to XSS attacks). The authentication system has been upgraded to an industry-standard flow:

*   **HttpOnly Cookies:** Both Access Tokens and Refresh Tokens are sent from the backend as `HttpOnly` and `Secure` cookies. They cannot be read by malicious JavaScript on the client side.
*   **Access Token (Short-Lived):** A 15-minute JWT used for authenticating API requests.
*   **Refresh Token Rotation (Long-Lived):** A 7-day token stored in the database. When the Access Token expires, the Axios Interceptor silently calls the `/api/auth/refresh` endpoint to exchange the valid Refresh Token for a brand new Access Token and a brand new Refresh Token.
*   **Axios Interceptors:** Global frontend configuration handles the `401 Unauthorized` token refresh lifecycle completely transparently to the user, ensuring uninterrupted sessions.

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, Bootstrap, Axios, React Router.
-   **Backend**: Node.js, Express.js, Cookie-Parser.
-   **Database**: MongoDB (with Mongoose).
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.js, HttpOnly Cookies.
-   **Tools**: ESLint, Nodemon.

## 📂 Project Structure

```bash
DevDesk/
├── client/         # React Frontend (Vite)
│   ├── src/        
│   │   ├── api/    # Axios config with Auto-Refresh Interceptors
│   │   ├── context/# Global Auth context checking HttpOnly cookies
│   │   └── ...
├── server/         # Node.js/Express Backend
│   ├── src/        
│   │   ├── middleware/ # JWT Cookie extraction
│   │   ├── routes/     # Auth endpoints (/register, /login, /refresh, /logout)
│   │   └── ...
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
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
# Add other necessary variables
```

Start the backend server (Ensure it runs on port 5002 to avoid OS proxy conflicts):

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

Create a `.env` file in the `client` directory to point to the secure API port:

```env
VITE_API_URL=http://127.0.0.1:5002/api
```

Start the frontend development server:

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
