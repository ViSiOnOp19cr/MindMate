# MindMate Quick Start Guide

This guide will help you quickly get started with MindMate, your AI-powered study assistant.

## Prerequisites

- Node.js 18 or higher
- npm or another package manager

## Setup Instructions

### 1. Install Dependencies

Run the following command in the root directory to install all dependencies:

```bash
npm run install:all
```

### 2. Environment Configuration

Create `.env` files:

#### For Frontend (in `apps/client`)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MindMate
```

#### For Backend (in `apps/server`)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AI_API_KEY=your_openai_api_key
```

### 3. Start the Application

Start both frontend and backend with a single command:

```bash
npm run start
```

Or start them separately:

```bash
# Start frontend only
npm run dev:client

# Start backend only
npm run dev:server
```

## Application Overview

- **Frontend**: Runs on `http://localhost:5173`
- **Backend**: Runs on `http://localhost:5000`
- **API**: Available at `http://localhost:5000/api`

## Features

- **User Authentication**: Sign up and login
- **Notes Management**: Create, edit, and organize notes in folders
- **AI Features**: Generate summaries and quizzes from your notes
- **Chat Interface**: Interact with an AI assistant for learning help
- **File Upload**: Attach reference materials to your studies

## Need Help?

Refer to the detailed documentation in the `README.md` files in both the client and server directories for more information.
