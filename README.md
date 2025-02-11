# PixelFlow

A lightweight and high-performance image conversion API built with Node.js and Sharp. Optimized for speed and efficiency, perfect for web applications requiring fast image format conversions.

## Features

- Lightning-fast image conversion using Sharp
- Convert images from file uploads or URLs
- Supports WebP, JPG, and PNG formats
- User-friendly web interface with URL input
- REST API with binary image responses
- Memory-efficient processing
- 10MB file size limit
- CORS enabled
- Dockerized deployment

## Performance

Built with Sharp, which offers:
- 4-5x faster processing than ImageMagick
- Minimal memory usage (~7-15MB per instance)
- Efficient handling of concurrent requests
- Small disk footprint

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start production server:
```bash
npm start
```

The server will be available at http://localhost:3000

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t pixelflow .
```

2. Run the container:
```bash
docker run -p 3000:3000 pixelflow
```

## API Usage

### Response Format
All successful image conversion endpoints return:
- Appropriate Content-Type header (`image/jpeg`, `image/webp`, or `image/png`)
- Raw image data in the requested format
- No forced download headers - client decides how to handle the response

### 1. Convert from File Upload

**Endpoint:** `POST /convert`

**Headers:**
- `Content-Type: multipart/form-data`

**Query Parameters:**
- `format` (required): `webp`, `jpg`, or `png`

**Request Body:**
- Form data with key `image` containing the image file
- Maximum file size: 10MB
- Supported inputs: JPG, JPEG, PNG, GIF, WebP

**Example Request:**
```bash
# Save response as file
curl -X POST \
     -F "image=@input.jpg" \
     "http://localhost:3000/convert?format=webp" \
     --output output.webp

# Process in Node.js
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:3000/convert?format=webp', {
  method: 'POST',
  body: formData
});

const buffer = await response.arrayBuffer();
```

### 2. Convert from URL

**Endpoint:** `POST /convert-url`

**Headers:**
- `Content-Type: multipart/form-data`

**Form Fields:**
- `url` (required): URL of the image to convert
- `format` (required): `webp`, `jpg`, or `png`

**Example Request:**
```bash
# Save response as file
curl -X POST \
     -F "url=https://example.com/image.jpg" \
     -F "format=webp" \
     "http://localhost:3000/convert-url" \
     --output output.webp

# Process in Node.js
const formData = new FormData();
formData.append('url', 'https://example.com/image.jpg');
formData.append('format', 'webp');

const response = await fetch('http://localhost:3000/convert-url', {
  method: 'POST',
  body: formData
});

const buffer = await response.arrayBuffer();
```

### Error Responses
When an error occurs, the API returns a JSON response:
```json
{
  "error": "Error message here"
}
```

Common error scenarios:
- Invalid format specified
- File too large (>10MB)
- Invalid image file
- Failed to fetch URL
- Processing error

### Web Interface
A user-friendly web interface is available at `http://localhost:3000` for testing the API.

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Node environment (development/production)

## Coolify Deployment

1. Connect your Git repository to Coolify
2. Create a new service using the Dockerfile
3. Configure environment variables if needed
4. Deploy!

Benefits:
- Minimal resource usage
- Fast startup time
- Efficient container size
- Production-ready configuration
