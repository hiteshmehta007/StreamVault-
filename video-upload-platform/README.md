# Video Upload Platform

This project is a video upload platform that allows users to upload, process, and manage their video content. It provides a user-friendly interface for uploading videos, collecting metadata, and monitoring upload progress.

## Features

- **Video Uploading**: Users can upload videos through a form or by dragging and dropping files.
- **Upload Progress**: Visual feedback on the upload progress with a progress bar and percentage.
- **Video Preview**: Users can preview their videos before finalizing the upload.
- **Metadata Collection**: Collects additional information such as title, description, and tags for each video.
- **Processing Status**: Displays the status of video processing after upload.
- **Quality Settings**: Allows users to select quality settings for their videos.
- **Thumbnail Generation**: Users can generate or upload a custom thumbnail for their videos.

## Project Structure

```
video-upload-platform
├── src
│   ├── components
│   │   ├── upload
│   │   │   ├── VideoUploadForm.tsx
│   │   │   ├── FileDropzone.tsx
│   │   │   ├── UploadProgress.tsx
│   │   │   ├── VideoPreview.tsx
│   │   │   └── MetadataForm.tsx
│   │   ├── processing
│   │   │   ├── ProcessingStatus.tsx
│   │   │   ├── QualitySettings.tsx
│   │   │   └── ThumbnailGenerator.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── progress.tsx
│   │       └── badge.tsx
│   ├── services
│   │   ├── uploadService.ts
│   │   ├── videoProcessingService.ts
│   │   ├── metadataService.ts
│   │   └── storageService.ts
│   ├── hooks
│   │   ├── useFileUpload.ts
│   │   ├── useVideoProcessing.ts
│   │   └── useUploadProgress.ts
│   ├── types
│   │   ├── upload.ts
│   │   ├── video.ts
│   │   └── processing.ts
│   ├── utils
│   │   ├── fileValidation.ts
│   │   ├── videoUtils.ts
│   │   └── uploadHelpers.ts
│   └── app.tsx
├── public
│   └── assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd video-upload-platform
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.