const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Get the base URL for images
const baseUrl = 'http://localhost:3000'; // Your backend URL

// Sample company data with full image URLs
const companies = [
  {
    id: 1,
    name: "TechNova Solutions",
    description: "Leading software development company specializing in innovative solutions.",
    image: `${baseUrl}/images/companies/technova.jpeg`
  },
  {
    id: 2,
    name: "Digital Marketers Inc.",
    description: "Premier digital marketing agency delivering results-driven campaigns.",
    image: `${baseUrl}/images/companies/digitalmarketers.jpeg`
  },
  {
    id: 3,
    name: "CreativeDesign Studios",
    description: "Award-winning design studio creating stunning visual experiences.",
    image: `${baseUrl}/images/companies/creativedesign.jpg`
  },
  {
    id: 4,
    name: "DataMetrics Analytics",
    description: "Data-driven company providing actionable insights through advanced analytics.",
    image: `${baseUrl}/images/companies/datametrics.png`
  },
  {
    id: 5,
    name: "CustomerCare Connect",
    description: "Customer service excellence is our priority.",
    image: `${baseUrl}/images/companies/customercare.jpg`
  },
  {
    id: 6,
    name: "ProjectPro Management",
    description: "Expert project management services for businesses of all sizes.",
    image: `${baseUrl}/images/companies/projectpro.jpeg`
  }
];

// Get all companies
router.get('/getAll', (req, res) => {
  try {
    // Create companies directory if it doesn't exist
    const companiesDir = path.join(__dirname, '..', 'images', 'companies');
    if (!fs.existsSync(companiesDir)) {
      fs.mkdirSync(companiesDir, { recursive: true });
    }
    
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;