const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
require('dotenv').config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Connect to MongoDB
connectDB();



// API routes will be added here

// Swagger documentation
// Note: We'll create the swagger.json file later
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});