# Image Conversion API

A fast and efficient image conversion API built with Node.js and Sharp, supporting conversion between JPG, WebP, and PNG formats.

## Features

- Convert images between JPG, WebP, and PNG formats
- Web interface for testing
- REST API endpoints
- Built with Sharp for optimal performance
- 10MB file size limit
- CORS enabled
- Docker support

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
docker build -t image-converter .
```

2. Run the container:
```bash
docker run -p 3000:3000 image-converter
```

## API Usage

### Convert Image Endpoint

`POST /convert?format=[jpg|webp|png]`

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

This application is ready for deployment on Coolify:

1. Connect your Git repository to Coolify
2. Create a new service using the Dockerfile
3. Configure environment variables if needed
4. Deploy!
