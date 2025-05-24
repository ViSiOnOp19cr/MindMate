#!/bin/bash

# Print header
echo "====================================="
echo "Starting MindMate Study Assistant"
echo "====================================="
echo ""

# Start backend server
echo "Starting backend server..."
cd apps/server
npm run dev &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"
echo ""

# Give the backend a moment to start
sleep 3

# Start frontend development server
echo "Starting frontend development server..."
cd ../client
npm run dev &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"
echo ""

echo "Both servers are now running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to handle termination
function cleanup {
  echo ""
  echo "Stopping servers..."
  kill $FRONTEND_PID
  kill $BACKEND_PID
  echo "Servers stopped"
  exit 0
}

# Register the cleanup function for SIGINT (Ctrl+C)
trap cleanup SIGINT

# Wait indefinitely
while true; do
  sleep 1
done
