const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

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
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Convert image from URL
app.post('/convert-url', express.json(), async (req, res) => {
  try {
    const { url, format } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    if (!['jpg', 'webp', 'png'].includes(format?.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid target format. Supported formats: jpg, webp, png' });
    }

    // Download image
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: 10 * 1024 * 1024, // 10MB limit
      timeout: 5000 // 5 second timeout
    });

    // Process image using Sharp
    const processedImage = await sharp(response.data)
      .toFormat(format === 'jpg' ? 'jpeg' : format)
      .toBuffer();

    // Set appropriate content type
    const contentTypes = {
      'jpg': 'image/jpeg',
      'webp': 'image/webp',
      'png': 'image/png'
    };

    res.set('Content-Type', contentTypes[format]);
    res.send(processedImage);

  } catch (error) {
    console.error('Error processing image URL:', error);
    if (axios.isAxiosError(error)) {
      res.status(400).json({ error: 'Failed to fetch image from URL' });
    } else {
      res.status(500).json({ error: 'Error processing image' });
    }
  }
});

// Convert image from file upload
app.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const targetFormat = req.query.format?.toLowerCase();
    if (!['jpg', 'webp', 'png'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid target format. Supported formats: jpg, webp, png' });
    }

    // Process image using Sharp
    const processedImage = await sharp(req.file.buffer)
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
