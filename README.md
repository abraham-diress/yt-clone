# youtube-clone

This repository contains a simple video processing microservice used in a YouTube style application. The service converts uploaded videos to 360p and uploads the processed file to Google Cloud Storage.

## video-processing-service

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Build the TypeScript source:
   ```
   npm run build
   ```

3. Start the service:
   ```
   npm start
   ```

The service exposes a `POST /process-video` endpoint. The request body should contain a Pub/Sub style message with a base64 encoded JSON payload specifying the name of the raw video file. The service downloads the file, processes it with `fluent-ffmpeg`, uploads the result and then cleans up the temporary files.

