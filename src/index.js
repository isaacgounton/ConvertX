const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

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
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and audio files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp3|ogg|oga|m4a)$/i)) {
      return cb(new Error('Only image and audio (MP3, OGG, OGA, M4A) files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Conversion lock mechanism
let isConverting = false;

// Audio conversion endpoint
app.post('/convert-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    if (isConverting) {
      return res.status(429).json({ error: 'Another conversion is in progress. Please try again later.' });
    }

    const sourceFormat = path.extname(req.file.originalname).toLowerCase().substring(1);
    const targetFormat = req.query.format?.toLowerCase();

    // Validate formats
    if (!['mp3', 'ogg', 'oga', 'm4a'].includes(sourceFormat) || !['mp3', 'ogg', 'oga'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid format. Supported formats: mp3, ogg, oga (output), m4a (input only)' });
    }

    if (sourceFormat === targetFormat) {
      return res.status(400).json({ error: 'Source and target formats are the same' });
    }

    isConverting = true;

    // Create temporary file paths
    const inputPath = path.join(__dirname, `temp_input.${sourceFormat}`);
    const outputPath = path.join(__dirname, `temp_output.${targetFormat}`);

    // Write buffer to temporary file
    require('fs').writeFileSync(inputPath, req.file.buffer);

    // Process audio using fluent-ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputPath)
        .toFormat(targetFormat)
        .on('end', resolve)
        .on('error', reject)
        .save(outputPath);
    });

    // Read the converted file
    const convertedBuffer = require('fs').readFileSync(outputPath);

    // Clean up temporary files
    require('fs').unlinkSync(inputPath);
    require('fs').unlinkSync(outputPath);

    // Get original filename without extension
    const originalFilename = path.parse(req.file.originalname).name;
    const newFilename = `${originalFilename}.${targetFormat}`;

    // Set appropriate headers
    const contentTypes = {
      'mp3': 'audio/mpeg',
      'ogg': 'audio/ogg',
      'oga': 'audio/ogg',
      'm4a': 'audio/mp4'
    };

    res.set({
      'Content-Type': contentTypes[targetFormat],
      'Content-Disposition': `attachment; filename="${newFilename}"`,
      'X-Original-Filename': newFilename
    });
    res.send(convertedBuffer);

  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Error processing audio' });
  } finally {
    isConverting = false;
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Convert image from URL
app.post('/convert-url', upload.none(), async (req, res) => {
  try {
    const { url, format } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'No image URL provided' });
    }

    const targetFormat = format?.toLowerCase();
    if (!['jpg', 'webp', 'png'].includes(targetFormat)) {
      return res.status(400).json({ error: 'Invalid target format. Supported formats: jpg, webp, png' });
    }

    // Download image
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: 10 * 1024 * 1024, // 10MB limit
      timeout: 5000 // 5 second timeout
    });

    // Extract original filename from URL
    const originalUrl = new URL(url);
    const originalFilename = path.basename(originalUrl.pathname);
    const filenameWithoutExt = path.parse(originalFilename).name;

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

    // Just set the correct content type
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

    // Extract original filename
    const originalFilename = path.parse(req.file.originalname).name;

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

    // Just set the correct content type
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
