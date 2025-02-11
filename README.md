# ConvertX

A lightweight and high-performance image conversion API built with Node.js and Sharp. Optimized for speed and efficiency, perfect for web applications requiring fast image format conversions.

## Features

- Lightning-fast image conversion using Sharp
- Supports WebP, JPG, and PNG formats
- User-friendly web interface
- REST API endpoints
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

### Convert Image Endpoint

`POST /convert?format=[webp|jpg|png]`

Example using curl:
```bash
curl -X POST -F "image=@your-image.jpg" "http://localhost:3000/convert?format=webp" --output converted.webp
```

### Health Check Endpoint

`GET /health`

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Node environment (development/production)

## Coolify Deployment

This application is optimized for Coolify deployment:

1. Connect your Git repository to Coolify
2. Create a new service using the Dockerfile
3. Configure environment variables if needed
4. Deploy!

Benefits of this setup:
- Minimal resource usage
- Fast startup time
- Efficient container size
- Production-ready configuration
