# MindMate: AI-Powered Study Assistant - Frontend

## Overview

MindMate is an AI-powered study assistant application that helps students organize their notes, generate summaries, create quizzes, and chat with an AI assistant. This repository contains the frontend code built with React, TypeScript, and various modern web technologies.

## Features

- **User Authentication**: Secure login and signup functionality
- **Dashboard**: Overview of your study materials and quick access to features
- **Notes Organization**: Create, view, edit, and delete notes with folder organization
- **AI Summaries**: Generate concise summaries of your notes using AI
- **AI Quizzes**: Create practice quizzes based on your notes
- **AI Chat Assistant**: Chat with an AI assistant for help with your studies
- **File Upload**: Upload study materials for reference

## Tech Stack

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **React Router**: Navigation and routing
- **Axios**: API client for backend communication
- **Formik & Yup**: Form handling and validation
- **React Toastify**: Toast notifications
- **CSS**: Custom styling with modern CSS

## Project Structure

```
/src
  /api         # API service modules
  /components  # Reusable UI components
  /contexts    # React contexts (Auth, etc.)
  /hooks       # Custom React hooks
  /pages       # Page components
  /types       # TypeScript type definitions
  /utils       # Utility functions
  App.tsx      # Main application component
  index.css    # Global styles
  main.tsx     # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see ../server directory)

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```bash
   cd apps/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
2. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```
or
```bash
yarn build
```

## API Integration

The frontend communicates with the backend through a set of API services located in the `/src/api` directory:

- `authService.ts`: Authentication endpoints (login, signup, etc.)
- `folderService.ts`: Folder management endpoints
- `noteService.ts`: Note management endpoints
- `aiService.ts`: AI-related endpoints (summaries, quizzes)
- `chatService.ts`: Chat functionality endpoints
- `fileUploadService.ts`: File upload endpoints

All API requests are made through the `apiClient.ts` module, which handles authentication, error handling, and request/response processing.

## User Authentication

Authentication is managed through the `AuthContext` which provides:

- User authentication state
- Login/Signup methods
- Logout functionality
- Protected route handling

JWT tokens are stored in localStorage for persistence across sessions.

## Customization

The application uses CSS variables for theming, which can be found in `index.css`. Modify these variables to change the look and feel of the application:

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  /* Other color and theme variables */
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

