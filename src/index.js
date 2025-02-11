const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pnm|pbm|pgm|ppm)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Convert image endpoint
app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const targetFormat = req.query.format?.toLowerCase();
    if (!['jpg', 'webp', 'png'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid target format. Supported formats: jpg, webp, png' });
    }

    let processedImage;
    
    // Process the image using Sharp
    processedImage = await sharp(req.file.buffer)
      .toFormat(targetFormat === 'jpg' ? 'jpeg' : targetFormat)
      .toBuffer();

    // Set appropriate content type
    const contentTypes = {
      'jpg': 'image/jpeg',
      'webp': 'image/webp',
      'png': 'image/png'
    };

    res.set('Content-Type', contentTypes[targetFormat]);
    res.send(processedImage);

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Image conversion API running at http://localhost:${port}`);
});
