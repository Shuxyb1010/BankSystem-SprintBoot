# Bank System

A full-stack banking application built with Spring Boot (Java) backend and React TypeScript frontend.

## 🏗️ Architecture

This project consists of two main components:

- **Backend**: Java Spring Boot REST API with JWT authentication
- **Frontend**: React TypeScript application with modern UI components

## 🚀 Features

### Backend Features

- User authentication and authorization with JWT
- Account management (create, view, update)
- Transaction processing (deposit, withdraw, transfer)
- Transaction history tracking
- RESTful API endpoints
- Spring Security configuration
- H2 database for development

### Frontend Features

- Modern, responsive UI built with React and TypeScript
- Protected routes with authentication
- Dashboard with account overview
- Transaction management interface
- Account creation and management
- Real-time balance updates
- Clean and intuitive user experience

## 🛠️ Tech Stack

### Backend

- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security**
- **Spring Data JPA**
- **H2 Database**
- **JWT Authentication**
- **Maven**

### Frontend

- **React 18**
- **TypeScript**
- **Vite**
- **CSS3**
- **ESLint**

## 📋 Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven 3.6 or higher
- Git

## 🚀 Getting Started

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd BankSystem
   ```

2. **Build the project:**

   ```bash
   mvn clean install
   ```

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd bank-ui
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## 📚 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/authenticate` - User login

### Accounts

- `GET /api/v1/accounts` - Get user accounts
- `POST /api/v1/accounts` - Create new account
- `GET /api/v1/accounts/{id}` - Get account details

### Transactions

- `POST /api/v1/transactions/deposit` - Deposit money
- `POST /api/v1/transactions/withdraw` - Withdraw money
- `POST /api/v1/transactions/transfer` - Transfer money
- `GET /api/v1/transactions/history` - Get transaction history

## 🗄️ Database Schema

The application uses H2 in-memory database with the following main entities:

- **User**: User information and credentials
- **Account**: Bank account details
- **Transaction**: Transaction records

## 🔐 Security

- JWT-based authentication
- Password encryption
- Protected API endpoints
- Role-based access control

## 🧪 Testing

### Backend Testing

```bash
cd BankSystem
mvn test
```

### Frontend Testing

```bash
cd bank-ui
npm test
```

## 📁 Project Structure

```
BankSystem/
├── BankSystem/                 # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/example/BankSystem/
│   │       ├── account/        # Account management
│   │       ├── auth/          # Authentication
│   │       ├── transaction/   # Transaction processing
│   │       └── user/          # User management
│   └── src/main/resources/
│       └── application.yml    # Configuration
├── bank-ui/                    # Frontend (React)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── types/            # TypeScript types
│   └── package.json
└── README.md
```


## 🔮 Future Enhancements

- [ ] Add more account types (Savings, Checking, etc.)
- [ ] Implement interest calculation
- [ ] Add email notifications
- [ ] Mobile app development
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] Integration with external payment systems

- [ ] Docker Image
- [ ] Add NGINX
- [ ] CI/CD Pipeline
- [ ] Deploy on AWS EC2
---
