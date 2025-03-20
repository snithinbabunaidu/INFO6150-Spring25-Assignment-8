# Secure RESTful API Implementation with Node.js, Express, and MongoDB

## Project Overview
This project implements a secure RESTful API using Node.js, Express, and MongoDB. The API allows for user management with CRUD operations and secure image uploading functionality. All endpoints have been tested using Postman.

## Features
- User creation with secure password hashing
- User profile updates
- User deletion
- Fetching all users
- Image upload with format validation and uniqueness per user

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **multer** - File upload handling
- **validator** - Input validation
- **Swagger/OpenAPI** - API documentation

## Project Structure
```
INFO6150-Spring25-Assignment-8/
│
├── app.js                  # Main application file
├── .env                    # Environment variables (not committed to git)
├── package.json            # Project dependencies
├── images/                 # Directory for storing uploaded images
│
├── config/
│   └── db.js               # MongoDB connection configuration
│
├── models/
│   └── User.js             # User model schema
│
├── controllers/
│   └── userController.js   # Controller for user operations
│
├── routes/
│   └── userRoutes.js       # API routes for user endpoints
│
└── swagger.json            # API documentation using Swagger
```

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/INFO6150-Spring25-Assignment-8.git
cd INFO6150-Spring25-Assignment-8
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/secure-api-db
```

4. Start the server:
```bash
node app.js
```

The server will start on the port specified in the `.env` file (default: 3000).

## API Documentation

### 1. Create User
- **Endpoint**: POST /user/create
- **Description**: Creates a new user with full name, email, and password.
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "password": "Password123!"
  }
  ```
- **Validation**:
  - Email must be in valid format
  - Full name must contain only alphabetic characters
  - Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character
- **Responses**:
  - 201: `{"message": "User created successfully."}`
  - 400: `{"error": "Validation failed."}`

### 2. Update User
- **Endpoint**: PUT /user/edit
- **Description**: Updates a user's full name and/or password.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "fullName": "John Smith",
    "password": "NewPassword123!"
  }
  ```
- **Responses**:
  - 200: `{"message": "User updated successfully."}`
  - 400: `{"error": "Validation failed."}`
  - 404: `{"error": "User not found."}`

### 3. Delete User
- **Endpoint**: DELETE /user/delete
- **Description**: Deletes a user by email.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```
- **Responses**:
  - 200: `{"message": "User deleted successfully."}`
  - 404: `{"error": "User not found."}`

### 4. Get All Users
- **Endpoint**: GET /user/getAll
- **Description**: Retrieves a list of all users.
- **Responses**:
  - 200: `{"users": [{"fullName": "John Doe", "email": "john.doe@example.com", "password": "$2b$10$..."}, ...]}`

### 5. Upload Image
- **Endpoint**: POST /user/uploadImage
- **Description**: Uploads an image for a user.
- **Request**:
  - Form-data:
    - email: User's email
    - image: Image file (JPEG, PNG, or GIF)
- **Responses**:
  - 201: `{"message": "Image uploaded successfully.", "filePath": "/images/filename.jpg"}`
  - 400: `{"error": "Invalid file format. Only JPEG, PNG, and GIF are allowed."}`
  - 400: `{"error": "Image already exists for this user."}`
  - 404: `{"error": "User not found."}`

## Swagger Documentation
API documentation is available at:
- Local: http://localhost:3000/api-docs
- Online: https://app.swaggerhub.com/apis/northeasternuniversi-585/Users/1.0.0#/

## Testing
All endpoints have been tested using Postman. A collection file is included in the repository for testing the API.

To import the Postman collection:
1. Open Postman
2. Click on "Import" button
3. Upload the `INFO6150-Assignment-8.postman_collection.json` file
4. Use the imported collection to test all endpoints

## Security Features
- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **Input Validation**: All user inputs are validated using appropriate validation rules
- **File Validation**: Image uploads are validated for format and size
- **Error Handling**: Comprehensive error handling with appropriate status codes

## Author
S Nithin Naidu

## License
This project is part of an academic assignment for INFO6150 at Northeastern University.