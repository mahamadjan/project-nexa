#!/bin/bash
echo "Starting NEXA Laptop Catalog Services..."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Kill existing processes
fuser -k 3000/tcp || true
fuser -k 5000/tcp || true
sleep 1

# Start backend
cd backend
echo "Starting Backend on port 5000..."
npx tsx src/index.ts &
BACKEND_PID=$!
cd ..

# Start frontend
cd frontend
echo "Starting Frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo "Both services are running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Press CTRL+C to stop all services."

# Wait for process exit
wait $FRONTEND_PID $BACKEND_PID
