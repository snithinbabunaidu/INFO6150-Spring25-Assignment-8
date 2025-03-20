const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB size limit
});

// Controller methods
const userController = {
  // 1. Create user
  createUser: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists." });
      }

      // Create new user
      const user = new User({
        fullName,
        email,
        password
      });

      await user.save();
      
      res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "Validation failed.", details: error.message });
      }
      res.status(500).json({ error: "Server error.", details: error.message });
    }
  },

  // 2. Update user details
  updateUser: async (req, res) => {
    try {
      const { email, fullName, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Update fields
      if (fullName) user.fullName = fullName;
      if (password) user.password = password;

      await user.save();
      
      res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: "Validation failed.", details: error.message });
      }
      res.status(500).json({ error: "Server error.", details: error.message });
    }
  },

  // 3. Delete user
  deleteUser: async (req, res) => {
    try {
      const { email } = req.body;

      // Find and delete user
      const user = await User.findOneAndDelete({ email });
      
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // If user had an image, delete it from storage
      if (user.imagePath) {
        const imagePath = path.join(__dirname, '..', user.imagePath);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Server error.", details: error.message });
    }
  },

  // 4. Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}, 'fullName email password');
      
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: "Server error.", details: error.message });
    }
  },

  // 5. Upload image
uploadImage: async (req, res) => {
    const uploadSingle = upload.single('image');
  
    uploadSingle(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
          // Remove uploaded file
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(404).json({ error: "User not found." });
        }
  
        // Check if user already has an image
        if (user.imagePath) {
          // Remove uploaded file
          if (req.file) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).json({ error: "Image already exists for this user." });
        }
  
        // Save image path to user WITHOUT triggering password validation
        // Use findOneAndUpdate instead of save() to avoid validation
        await User.findOneAndUpdate(
          { email }, 
          { imagePath: `/images/${req.file.filename}` },
          { runValidators: false }
        );
  
        res.status(201).json({ 
          message: "Image uploaded successfully.", 
          filePath: `/images/${req.file.filename}`
        });
      } catch (error) {
        // Remove uploaded file in case of error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Server error.", details: error.message });
      }
    });
  }
};

module.exports = userController;